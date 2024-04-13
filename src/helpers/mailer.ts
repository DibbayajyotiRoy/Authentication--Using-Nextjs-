import User from '@/model/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'



export const sendEmail = async({email, emailType, userId}:any) => {
    try {

      const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if ( emailType === 'VERIFY') {
          await User.findByIdAndUpdate(userId,
             { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
          )
        }else if( emailType === 'RESET' ){
           await User.findByIdAndUpdate(userId,
          { forgotPasswordToken: hashedToken, forgotPasswordTokenExpire: Date.now() + 3600000 }
       )}

       var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "eaf5268e03f409",
          pass: "2ee9a14018da3f"
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









