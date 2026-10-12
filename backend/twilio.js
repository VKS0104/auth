require('dotenv').config();
const twilio = require('twilio')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid,authToken);

const sendOtp =()=>{
  return client.messages.create({
    body:`sms_2fa`,
    from: '+17372508034',
    to: "+917439893902",
  })
}

module.exports = sendOtp;
