const rootRouter      = require('express').Router()
const AuthController  = require('../controllers/authController')
const UserController  = require('../controllers/userController')
const isAuth          = require('../middlewares/isAuth')
const isNotAuth       = require('../middlewares/isNotAuth')

rootRouter.post('/register', [
    isNotAuth, AuthController.register
])
rootRouter.post('/login', [
    isNotAuth, AuthController.login
])
rootRouter.put('/profile', [
    isAuth, UserController.update
])
module.exports = rootRouter