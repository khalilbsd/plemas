import express from 'express'
import { addUser, getAll, getUserInfo,updateProfile, updateProfileImage,authenticateUserWithToken,banUser, getPotentielProjectManager,changeUserRole, unBanUser } from '../controllers/users/user.controller.js'
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'
// import uploader from '../middleware/imageUploader.js'
import createMulterMiddleware from '../middleware/uploader.js'
import { SUPERUSER_ROLE } from '../constants/constants.js'


const router = express.Router()

const profileImageUploader = createMulterMiddleware('profileImage')

router
.get('/list',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),getAll)
.get('/potentiel/manger/list',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),getPotentielProjectManager)
.post('/user_info',isUserAuthenticated,getUserInfo)
.post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),addUser)
.patch('/profile/change',isUserAuthenticated,profileImageUploader,updateProfile)
.patch('/profile/image/change',isUserAuthenticated,profileImageUploader,updateProfileImage)
.get('/confirmation/auth/1.0/token=:token',authenticateUserWithToken)
.patch('/change/user/role',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),changeUserRole)
.patch('/ban/user/deactivate',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),banUser)
.patch('/ban/user/activate',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),unBanUser)
export default router
