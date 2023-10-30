import express from 'express'
import { login, passwordReset, setUserPassword,checkUserPassword,sendResetPasswordEmailToken, resetPasswordTokenVerify, passwordResetWithToken } from '../controllers/auth/authentication.js'
import { isUserAuthenticated } from '../middleware/auth.js'


const router = express.Router()


router
.post('/login',login)
.post('/change/password/v/1.0',setUserPassword)
.post('/password/reset/check-current',isUserAuthenticated,checkUserPassword)
.post('/password/reset/v/1.0',isUserAuthenticated,passwordReset)
.post('/password/reset/token/1.0/token=:token',passwordResetWithToken)
.post('/password/reset/email/send/token/v/1.0',sendResetPasswordEmailToken)
.get('/password/reset/email/verify/token/v/1.0/token=:token',resetPasswordTokenVerify)
// .post('/password/reset/send-request/token',isUserAuthenticated,passwordReset)

export default router