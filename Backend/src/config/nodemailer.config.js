import nodemailer from 'nodemailer';
import oauth2Client from './oauth.config.js';

const SENDER_EMAIL = process.env.SENDER_EMAIL;

const getaccesstoken = async () => {
  try {
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
  }
};

const createTransporter = async () => {
  const accessToken =  await getaccesstoken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: SENDER_EMAIL,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken,
    },
  });
};

export default createTransporter;