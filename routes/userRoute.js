const express = require('express');
const router = express.Router();
const config = require('../config/config');
const { generateAccessToken, generateRefreshToken, parseTokenAndGetUserId } = require('../utils/token-util');

const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {
  userProperty: 'currentUser',
  session: false,
});

const generateTokensAndAuthenticateUser = async (res, userId) => {
  const user = await findUserById(userId);
  const { token: access_token, expiration: token_expiration } = await generateAccessToken(userId);
  const { token: refreshToken } = generateRefreshToken(userId);
  res.cookie('refresh_token', refreshToken, { httpOnly: true });
  res.status(200).json({ access_token, token_expiration, user });
};

router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    const doesEmailExist = await fieldExists('email', email);

    if (!doesEmailExist) {
      const user = await registerUser(req.body);
      await generateTokensAndAuthenticateUser(res, user._id);
    }
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/refresh-token', async (req, res) => {
  try {
    const tokenEncrypted = req.cookies.refresh_token;
    const userId = await parseTokenAndGetUserId(tokenEncrypted);
    await generateTokensAndAuthenticateUser(res, userId);
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/logout', requireAuth, (req, res) => {
  res.cookie('refresh_token', '', { httpOnly: true });
  res.status(200).end();
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);
    await checkPassword(password, user);
    await generateTokensAndAuthenticateUser(res, user._id);
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
