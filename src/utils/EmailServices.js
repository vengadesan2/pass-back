import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
              //fhqy irzg xazn sliq
              user: 'vengadesanguna24@gmail.com',
              pass: 'pkhyxnajllzvybmr'  
      },
      tls: {
        rejectUnauthorized: false
      }
});

let forgotPasswordMail = async(to,emailVerifyURL) => {
    try {
        let mailContent = await transporter.sendMail({
            from: 'vengadesanguna24@gmail.com',
            to: to,
            subject: 'Code to reset password',
            html: `<div><h3>Hi sir/mam</h3></div>
            <div>
              <p>To reset your password,click the below link</p>
              <a href="${process.env.BASE_URL}/forgotpassword/${emailVerifyURL}>${emailVerifyURL}</a>     
              <p>Thanks!!!</p>       
            </div>
            `
        }) 
        console.log(mailContent.messageId, " - email sent");
    } catch (error) {
        console.log(error.message);
    }
}

export default forgotPasswordMail

