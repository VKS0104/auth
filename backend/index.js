require('dotenv').config();

let express = require('express')
let app = express()
let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')
let cors = require('cors')
let jwt = require('jsonwebtoken')
let crypto = require('crypto')
let { sendEmail } = require('./config/sendEmail.js')
let sendOtp = require('./twilio.js')
let { OAuth2Client } = require('google-auth-library')

const { User, Product } = require('./DataBase/fsCopy.js')


app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/rdbms').then(() => {
  console.log('db connected succesfully.....');

})

let googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth/google', async (req, res) => {
  try {
    const { credential } = req.body; //google id token hai credential bol dete hai google docs maine
    if (!credential) {
      return res.status(400).json({
        msg: "Google credential is required"
      })
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })


    /* Claim	Meaning
      sub:	Google's stable identifier for the account
      email:	Email address associated with the Google account
      email_verified:	Whether Google indicates the email has been verified
      name:	User's name, when available
      picture:	Profile image URL, when available
      aud:	Intended audience/client ID
      exp:	Token expiration time */

    let payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        message: "Google account email is not verified",
      });
    }
    //we only have to allow verified email address
    const { sub: googleId, name, email } = payload;

    let user = await User.findOne({ googleId })
    if (!user) {
      const existingUserEmail = await User.findOne({ email })
      if (existingUserEmail) {
        return res.status(409).json({
          message:
            'An account with this email already exists. Please log in using your existing method first.',
        });
      }
      //naya google user register
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        role:"user",
      })
    }

    //jwt token dedo
    const token = jwt.sign({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    })

    return res.status(200).json({
      msg: "google authentication successfull",
      token: token,
    })


  }
  catch (err) {

    console.error('Google authentication error:', err.message);

    return res.status(401).json({
      message: 'Google authentication failed',
    })

  }
})

app.post('/send-otp', async (req, res) => {
  // let {phoneNumber} = req.body;
  let otp = Math.floor(Math.random() * 1000000);
  let otpExpiry = Date.now() + (1 * 60 * 1000);
  console.log(otp, otpExpiry);

  try {
    const result = await sendOtp();
    console.log("SUCCESS:", result);
    res.send("success")
  } catch (error) {
    console.log("FULL ERROR:");
    console.log(error);
    console.log("message:", error.message);
    console.log("code:", error.code);
    console.log("status:", error.status);
    console.log("moreInfo:", error.moreInfo);
  }
}

)



app.post('/signUp', async (req, res) => {
  let { name, email, password, role } = req.body;

  let findData = await User.findOne({ email })
  if (findData) {
    return res.send("User Already Exist, Please Login")
  }
  else {
    let hashedPass = await bcrypt.hash(password, 10);
    let UserInfo = new User({
      name,
      email,
      password: hashedPass,
      role: role || 'user',
    })

    await UserInfo.save();
    res.send("dooooneeee.....")
  }
})


app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  let findData = await User.findOne({ email })

  if (!findData) {
    return res.send("Kripa SignUp Kare")
  }
  else {
    let isUser = await bcrypt.compare(password, findData.password);
    if (!isUser) {
      return res.send("galat hai galat hai pass galat hai")
    }
    else {
      let token = jwt.sign({ userId: findData._id, name: findData.name, email: findData.email, role: findData.role }, process.env.JWT_SECRET, {
        expiresIn: "1h"
      });
      return res.json({
        msg: "hi",
        token: token,
      })
    }
  }
})

let auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Token missing");
  }

  try {
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).send("Invalid or expired token");
  }
}

let roleCheck = (role) => {

  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.send("who are you")
    }
    else {
      return next();
    }
  }

}

app.get('/admin', auth, roleCheck('admin'), (req, res) => {

  res.send("Only admin can access it")
})

app.get('/me', auth, async (req, res) => {
  let user = await User.findById(req.user.userId);

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json({
    name: user.name,
    email: user.email,
    role: user.role
  });

})

app.put('/me', auth, async (req, res) => {

  let { name } = req.body

  let user = await User.findByIdAndUpdate(
    req.user.userId,
    { name: name },
    { new: true }
  )
  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json({
    name: user.name,
    email: user.email,
    role: user.role
  });

})

app.get('/users', auth, roleCheck('admin'), async (req, res) => {
  let users = await User.find().select('-password')
  res.json(users);
})


app.patch('/users/:id/role', auth, roleCheck("admin"), async (req, res) => {
  let { role } = req.body;
  if (role !== "user" && role !== "admin") {
    return res.status(400).send("Invalid role");
  }

  let user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json({
    name: user.name,
    email: user.email,
    role: user.role
  });
})

app.post('/orders', auth, async (req, res) => {
  let userId = req.user.userId;

  let { productName, amount } = req.body;
  let Prod_Details = new Product({
    userId,
    productName,
    amount,
  })

  console.log(Prod_Details);

  await Prod_Details.save();
  res.send("done dana dan done")


})

app.get('/my-orders', auth, async (req, res) => {
  let userId = req.user.userId;
  let findOrder = await Product.find({ userId })

  if (findOrder) {
    res.json(findOrder)
  }
  else {
    res.send("aapne koi order nahi kiya hai")
  }
})

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }


    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();


    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // `${req.protocol}://${req.get('host')}/api/reset-password/${resetToken}`
    await sendEmail(
      user.email,
      'Password Reset Request',
      `Click the link below to reset your password:\n\n${resetUrl}`
    );

    res.status(200).send('Password reset email sent');
  } catch (error) {
    res.status(500).send('Error sending password reset email: ' + error.message);
  }
});


app.post('/api/reset-password/:resetToken', async (req, res) => {
  let { resetToken } = req.params;
  let { newPassword } = req.body;


  let findUser = await User.findOne({ resetToken })

  if (!findUser) {
    return res.status(404).send("Invalid ResetTOken")
  }

  if (findUser.resetTokenExpiry < Date.now()) {
    return res.status(400).send("Reset token has expired");
  }

  let hashedPass = await bcrypt.hash(newPassword, 10);

  findUser.password = hashedPass;

  await findUser.save();

  res.send("Password reset successfully");
})


app.listen(3000, () => {
  console.log("server runninggggg.........");
})