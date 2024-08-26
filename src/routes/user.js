import express from 'express'
import registerLoginController from '../controller/registerLogin_controller.js'
import postController from '../controller/postController.js'
import orderController from '../controller/orderController.js'
import auth from '../utils/auth.js'
import uploadController from '../controller/uploadController.js'
import usersDataController from '../controller/usersDataController.js'
import usersController from '../controller/UsersController.js'

// import searchController from '../controller/searchController.js'
// import multer from 'multer'
const router = express.Router()

router.get('/get',(req,res)=>{
    res.send(`<h1>Welcome to Chillhub</h1>`)
})
router.post('/',registerLoginController.login)
router.post('/register',registerLoginController.register)
router.put('/forgotPassword',registerLoginController.forgotPassword)
router.get('/forgotPassword/:id/verify/:token',registerLoginController.verifyCode)
router.put('/resetPassword',registerLoginController.resetPassword)
router.put('/editprofile',registerLoginController.editprofile)

//AfterLogin
router.get('/home',auth.authenticate,auth.userGuard,postController.home)
// router.get('/home/searchdata/:id',auth.authenticate,searchController.searchData)
router.post('/home/addpost',auth.authenticate,auth.getUserEmail,uploadController.postUpload.single('img-file') ,postController.createPost)
// router.get('/home/getposts/:id', auth.authenticate, postController.getProductdata)
router.get('/home/getproductdata', postController.getProductdata)
router.get('/home/getproductdata/:id', postController.getproductid)
router.post('/home/order',orderController.orderdata)
router.delete('/home/deleteuserpost/:id',auth.authenticate, postController.deleteUserPost)
router.post('/home/updatepost/:id/:postId',auth.authenticate,postController.updatePost)
// router.put('/home/updatePostReaction/:id', postController.updatePostLikeStatus)
// User Profile Datas
router.post('/home/adduserdatas',auth.authenticate,auth.getUserEmail,uploadController.profilePicUpload.single('imageDP'),usersDataController.addUsersData)
router.get('/home/getuserdatas/:id',usersDataController.getUsersData)

//frds datas
router.put('/home/addfriend/:id/:friendId',auth.authenticate,usersController.addFriend)
router.put('/home/removefriend/:id/:friendId',auth.authenticate,usersController.removeFriend)
router.get('/home/getusers/:id', auth.authenticate, usersController.getNewFrds)
router.get('/home/getUsersBday/:id', auth.authenticate, usersController.getUsersBday)
router.get('/home/getmyfriends/:id', auth.authenticate, usersController.getMyFriends)
router.get('/home/getmyonlinefriends/:id', auth.authenticate, usersController.getMyOnlineFriends)


export default router