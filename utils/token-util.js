const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { decrypt, encrypt } = require('./encryption-util');

const TokenType = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

const generateAccessToken = (userId) => {
  return generateToken(userId, TokenType.ACCESS_TOKEN);
};

const generateRefreshToken = (userId) => {
  return generateToken(userId, TokenType.REFRESH_TOKEN);
};

const generateToken = (userId, type) => {
  const audience = config.get('authentication.token.audience');
  const issuer = config.get('authentication.token.issuer');
  const secret = config.get('authentication.token.secret');
  const expiresIn =
    type === TokenType.ACCESS_TOKEN
      ? config.get('authentication.token.expiresIn')
      : config.get('authentication.refreshToken.expiresIn');

  const token = jwt.sign({ type }, secret, {
    expiresIn,
    audience,
    issuer,
    subject: userId,
  });

  return {
    token: encrypt(token),
    expiration: jwt.decode(token).exp * 1000,
  };
};

const getTokenType = (token) => {
  return jwt.verify(token, config.get('authentication.token.secret')).type;
};

const parseTokenAndGetUserId = (token) => {
  const decryptedToken = decrypt(token);
  const decoded = jwt.verify(decryptedToken, config.get('authentication.token.secret'));
  return decoded.sub || '';
};

module.exports = {
  TokenType,
  generateAccessToken,
  generateRefreshToken,
  getTokenType,
  parseTokenAndGetUserId,
};
