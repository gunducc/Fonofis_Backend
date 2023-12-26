const express = require('express');
const router = express.Router();
const app = express();
const passport = require("passport");

app.get('/login', passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login-fail',
}));

app.post('/callback', passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login-fail',
}));

app.get('/sso/logout', (req,res) => {
    req.logout();
    res.redirect('/goodbye');
})

module.exports = router;