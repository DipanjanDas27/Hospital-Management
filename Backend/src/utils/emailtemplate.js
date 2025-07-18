const otpTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px;">
      <h2 style="text-align: center; color: #4CAF50;">NovaMed OTP Verification</h2>
      <p>Dear user,</p>
      <p>Your One-Time Password (OTP) is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; letter-spacing: 4px; font-weight: bold; background: #eee; padding: 10px 20px; border-radius: 5px;">
          ${otp}
        </span>
      </div>
      <p>This OTP is valid for 2 minutes. If you didn’t request it, please ignore this email.</p>
      <p style="margin-top: 30px;">— NovaMed HMS Team</p>
    </div>
  </div>
`;

const forgetpasswordotptemplate = (otp) => `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password - OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
        padding: 20px;
      }
      .container {
        max-width: 500px;
        margin: auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #1a73e8;
        letter-spacing: 4px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Hi,</p>
      <p>You requested to reset your password. Please use the OTP below to proceed:</p>
      <p class="otp">${otp}</p>
      <p>This OTP will expire in 2 minutes for your security. If you did not request this, please ignore this email.</p>
      <p>Thank you,<br />NovaMed Team</p>
      <div class="footer">
        This is an automated email. Please do not reply.
      </div>
    </div>
  </body>
</html>
`
const welcomeemailtemplate = (username,) => `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to NovaMed</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f7fa;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }

    .header {
      background-color: #2a9d8f;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .content {
      padding: 30px 20px;
      color: #333333;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin: 15px 0;
    }

    .cta-button {
      display: inline-block;
      margin-top: 20px;
      background-color: #264653;
      color: #ffffff !important;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #a0aec0;
      padding: 20px;
      background-color: #f1f5f9;
    }
  </style>
</head>
<body>

  <div class="email-container">
    <div class="header">
      <h1>Welcome to NovaMed, ${username}!</h1>
    </div>

    <div class="content">
      <p>Hi ${username},</p>
      <p>We're excited to have you onboard! Your account has been successfully created.</p>
      <p>You can now access your personalized dashboard, book appointments, manage records, and much more.</p>
      <p>If you didn't register for a NovaMed account, please ignore this message or contact our support team immediately.</p>
    </div>

    <div class="footer">
      &copy; 2025 NovaMed. All rights reserved.
    </div>
  </div>

</body>
</html>

`
const logintemplate =(username)=>`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NovaMed Login Alert</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f7fa;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }

    .header {
      background-color: #2a9d8f;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
    }

    .content {
      padding: 30px 20px;
      color: #333333;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin: 15px 0;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #a0aec0;
      padding: 20px;
      background-color: #f1f5f9;
    }
    .details-box p {
      margin: 8px 0;
      font-size: 15px;
    }
  </style>
</head>
<body>

  <div class="email-container">
    <div class="header">
      <h1>Login Successful</h1>
    </div>

    <div class="content">
      <p>Hi ${username},</p>
      <p>Your NovaMed account was successfully accessed.</p>

      <p>If this was you, no further action is needed.</p>
      <p>If you did not initiate this login, please reset your password immediately or contact NovaMed Support.</p>
    </div>

    <div class="footer">
      &copy; 2025 NovaMed. All rights reserved.
    </div>
  </div>

</body>
</html>

`


export { otpTemplate, forgetpasswordotptemplate , welcomeemailtemplate, logintemplate} 
