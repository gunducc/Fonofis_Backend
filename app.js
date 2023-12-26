const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT || 4000
const {
  passportconfig,
} = require('./config/config');


const userRouter = require('./routes/userRoute');
const loginRouter = require('./routes/loginRoute');
const auth = require('./auth/auth');

//const { errorHandler } = require('./server/v1/middlewares');

const app = express();

app.use(express.urlencoded({
  extended: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(helmet());

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//= ==========Registering Router==========
app.use('/user/v1/', userRouter);
app.use('/login/v1/', loginRouter);
app.use('/auth/v1/',auth);

app.listen(PORT, ()=>{
  console.log(`listening on port: ${PORT}`)
})

//= ======ERROR Handler
//app.use(errorHandler);

module.exports = app;