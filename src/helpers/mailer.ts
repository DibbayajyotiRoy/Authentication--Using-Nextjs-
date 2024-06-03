import User from '@/model/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail = async({email, emailType, userId}:any) => {
    try {

      const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if ( emailType === 'VERIFY') {
          const updatedUser = await User.findByIdAndUpdate(userId,{
            $set:
              { verifyToken: hashedToken, verifyTokenExpiry: new Date(Date.now() + 3600000) }
              //Expiry after 1 hour
          }
          )
        }else if( emailType === 'RESET' ){
          await User.findByIdAndUpdate(userId,
          {$set:{ forgotPasswordToken: hashedToken, forgotPasswordTokenExpire: new Date(Date.now() + 3600000) }}
       )}

       var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "ec9c695e37a4af",
          pass: "d95beae6955a24"
        }
      });

          const mailOptions = {
            from: 'JohnDoe@johndoe.ai', 
            to: email, 
            subject: emailType === 'VERIFY' ? "Verify your Email" : "Reset your password", 
            html: `<p>Click <a href="${process.env.DOMAIN}">here</a> to ${emailType === "VERIFY" ? "verify your email": "reset your password"} or copy paste the link below in your browser <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`,
          }

          const mailResponse = await transport.sendMail(mailOptions)

          return mailResponse

    } catch (error:any) {
        throw new Error(error.message)
    }
}









