import express from 'express'
import { login, passwordReset, setUserPassword,checkUserPassword } from '../controllers/auth/authentication.js'
import { isUserAuthenticated } from '../middleware/auth.js'


const router = express.Router()


router
.post('/login',login)
.post('/change/password/v/1.0',setUserPassword)
.post('/password/reset/check-current',isUserAuthenticated,checkUserPassword)
.post('/password/reset/v/1.0',isUserAuthenticated,passwordReset)
// .post('/password/reset/send-request/token',isUserAuthenticated,passwordReset)

export default router