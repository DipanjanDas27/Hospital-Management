const otpMap = new Map();

export const saveOTP = (email, otp, ttl = 2 * 60 * 1000) => {
  otpMap.set(email,otp);
  setTimeout(() => otpMap.delete(email), ttl);
};

export const getOTP = (email) => otpMap.get(email);

export const clearOTP = (email) => otpMap.delete(email);
