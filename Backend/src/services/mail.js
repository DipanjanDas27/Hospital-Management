import resend from "./resend.js";

const SENDER_EMAIL = process.env.SENDER_EMAIL;  

const sendMail = async ({ to, subject, html }) => {
  try {
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });

    return result;
  } catch (error) {
    console.error("Resend Email Error:", error);
    throw new Error("Failed to send email");
  }
};

export default sendMail;
