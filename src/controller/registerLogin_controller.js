import auth from '../utils/auth.js'
import RegisterLoginModel from '../models/registerLogin_Model.js'
import forgotPasswordMail from '../utils/EmailServices.js'

const login = async(req,res) => {
    try {
        const {email,password} = req.body
        const user = await RegisterLoginModel.findOne({email:email})
        // console.log(user.email);
        if(user){
            if(await auth.hashCompare(password,user.password)){
                const token = await auth.createLoginToken({
                    id : user._id,
                    name:`${user.firstName} ${user.lastName}`,
                    email:user.email,
                    role:user.role
                })
                res.status(200).send({
                    message:"Login successfull",
                    token,
                    id:user._id,
                    role:user.role
                })
            }else{
                res.status(400).send({
                    message: "Incorrect password"
                })
            }
        }else{
            res.status(400).send({
                message: "Email-Id not found"
            })
        }
        
    } catch (error) {
        res.status(500).send({
            message : "Internal server error in logging in",
            error : error.message
        })
    }
}

const register = async(req,res) => {
    try {
        const {email, password} = req.body
        const user = await RegisterLoginModel.findOne({email : email})
        if(!user){
            req.body.password = await auth.createHash(password)
            let newUser = await RegisterLoginModel.create(req.body)
            res.status(200).send({
                message : "User created successfully",
            }) 
        }else{
            res.status(400).send({
                message : `User with ${req.body.email} already exists`
            })
        } 
    } catch (error) {
        res.status(500).send({
            message : "Internal server error in creating user",
            error : error.message
        })
    }
}

const forgotPassword = async(req,res) => {
    try {
        const {email} = req.body
        const userEmail = await RegisterLoginModel.findOne({email:req.body.email})
        // console.log(userEmail.email);
        if(userEmail){
            req.body.email = await auth.createHash(email)
            let emailToHash = req.body.email
            let hashedEmail = await RegisterLoginModel.updateOne({emailHash : req.body.email})
            const forgotPassToken = await auth.createForgotPassToken({
                email:userEmail.email,
                _id : userEmail._id
            })
            res.status(200).send({
                message : "Please Check Your Email",
                email: userEmail.email,
                _id : userEmail._id,
                forgotPassToken
            })        
            // console.log(forgotPassToken);
            const result = await RegisterLoginModel.findOneAndUpdate({email:email},{$set : {forgotPassToken : forgotPassToken,emailHash : req.body.email}})
            const getUserData = await RegisterLoginModel.findById(result._id)
            // console.log(result,getEntry)
            const emailVerifyURL = `${getUserData.emailHash}/verify/${getUserData.forgotPassToken}`
            // console.log(emailVerifyURL);
            await forgotPasswordMail(email, emailVerifyURL) 
        }else{
            res.status(400).send({
                message: "Emailid not found"
            })
        }              
    } catch (error) {
        res.status(500).send({
            message : "Internal server error in fetching email",
            error : error.message
        })
    }
}

const verifyCode = async(req,res) => {
    try {
        const dataToVerify = await RegisterLoginModel.findOne({emailHash: req.params.id,forgotPassToken: req.params.token})
        // console.log(dataToVerify)
        //   if (!dataToVerify) return res.status(400).json({ message: "invalid link" });
        if(dataToVerify){
            await RegisterLoginModel.findOneAndUpdate({ _id: dataToVerify._id },
                { $set: {  userPassID: "", userPassToken: "" } }
            );
            await RegisterLoginModel.findOneAndUpdate({ _id: dataToVerify._id },
                { $unset: { userPassID: "", userPassToken: "" } }
            );
            res.status(200).send({
                message : "Email verified Successfully"
            })
        }else{
            res.status(400).send({
                message: "Invalid Link",
                error : error.message
            })
        }
    } catch (error) {
        res.status(500).send({
            message : "Internal server error in verifing code",
            error : error.message
        })
    }
}

const resetPassword = async(req,res) => {
    try {
        const user = await RegisterLoginModel.findOne({email : req.body.email})
        if(user){
            // console.log(user);
            req.body.password = await auth.createHash(req.body.password)
            let resetPwd = await RegisterLoginModel.updateOne({password : req.body.password})
            res.status(200).send({
                message : "Password updated successfully",
                resetPwd
            }) 
        }else{
            res.status(400).send({
                message : `User with ${req.body.email} doesn't exists`
            })
        } 
        
    } catch (error) {
        res.status(500).send({
            message : "Internal server error in Updating password",
            error : error.message
        })
    }
}
const editprofile = async(req,res) => {
    try {
        const user = await RegisterLoginModel.findOne({email : req.body.email})
        if(user){
            // console.log(user);
            let resetPwd = await RegisterLoginModel.updateOne({password : req.body.password})
            res.status(200).send({
                message : "Password updated successfully",
                resetPwd
            }) 
        }else{
            res.status(400).send({
                message : `User with ${req.body.email} doesn't exists`
            })
        } 
        
    } catch (error) {
        res.status(500).send({
            message : "Internal server error in Updating password",
            error : error.message
        })
    }
}
export default {
    login,
    register,
    forgotPassword,
    verifyCode,resetPassword,
    editprofile 
  
}