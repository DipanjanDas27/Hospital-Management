import createTransporter from './nodemailer.js';

const SENDER_EMAIL = process.env.SENDER_EMAIL;

const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendMail;