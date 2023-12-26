const { UserModel } = require('./models/user');
const { Strategy: JwtStrategy } = require('passport-jwt');
const config = require('./config/config');
const passport = require('passport');
const { decrypt } = require('./utils/encryption-util');
const { getTokenType, TokenType } = require('./utils/token-util');
const { Request } = require('express');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req) => {
        try {
          if (!req.headers.authorization) {
            throw new Error('token was not provided, authorization header is empty');
          }

          const tokenFromHeader = req.headers.authorization.replace('Bearer ', '').trim();
          const decryptedToken = decrypt(tokenFromHeader);
          const tokenType = getTokenType(decryptedToken);

          if (tokenType !== TokenType.ACCESS_TOKEN) {
            throw new Error('wrong token type provided');
          }

          return decryptedToken;
        } catch (e) {
          console.error('Token is not valid', e.message);
          return null;
        }
      },
      secretOrKey: config.get('authentication.token.secret'),
      issuer: config.get('authentication.token.issuer'),
      audience: config.get('authentication.token.audience'),
      passReqToCallback: true,
    },
    (req, payload, done) => {
      UserModel.findById(payload.sub, (err, user) => {
        if (err) {
          return done(err, false);
        }
        req.currentUser = user?.toObject();
        return !user ? done(null, false) : done(null, user);
      });
    },
  ),
);
