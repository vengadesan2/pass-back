import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'

//hashing the datas
const SALT = 10
const createHash = async(data) => {
    let salt = await bcrypt.genSalt(SALT)
    let hash = await bcrypt.hash(data,salt)
    return hash
}

const verifySalt = async(SALT) => {
    let saltVerify = await bcrypt.genSalt(SALT)
    return saltVerify
} 

const hashCompare = async(data, hash) => {
    return await bcrypt.compare(data,hash)
}

//generating jwt's

const createLoginToken = async(payload) => {
    // console.log(process.env.JWT_SECRETKEY_LOGIN);
    let token = await Jwt.sign(payload,process.env.JWE_SECRET,{
        expiresIn : process.env.JWE_EXPIRE
    })
    return token
}

const decodeLoginToken = async(token) => {
    return await Jwt.decode(token)
}

const createForgotPassToken = async(payload) => {
    let token = await Jwt.sign(payload,process.env.JWE_SECRET,{
        expiresIn : process.env.JWE_EXPIRE
    })
    return token
}

const decodeForgotPassToken = async(token) => {
    return await Jwt.decode(token)
}

// const createAddPostToken = async(payload) => {
//     let token = await Jwt.sign(payload,process.env.JWT_SECRETKEY_ADDPOST,{
//         expiresIn : process.env.JWT_EXPIRY_ADDPOST
//     })
//     return token
// }

// const decodeAddPostToken = async(token) => {
//     return await Jwt.decode(token)
// }

// ------------------------------------MIDDLEWARES-----------------------------------------------------------------------------------

//mailid based authentication
const authenticate = async(req,res,next) => {
        let token = req?.headers?.authorization?.split(' ')[1]
        // console.log(token,);
        if(token){
            let payload = await decodeLoginToken(token)
            let currentTime = +new Date()
            // console.log(payload);
            if(Math.floor(currentTime/1000)<payload.exp){
                next()
            }else{
                res.status(402).send({
                    message :"Session expired"
                })
            }
        }else{
            res.status(402).send({
                message :"Session is no longer available"
            })
        }
}

//role based authenticate
const userGuard = async(req,res,next) => {
    let token  = req?.headers?.authorization?.split(' ')[1]
    if(token){
        let payload = await decodeLoginToken(token)
        if(payload.role === "user"){
            next()
        }else{
            res.status(401).send({
                message :"Only Users are allowed"
            })
        }        
    }else{
        res.status(500).send({
            message :"Unauthorised access"
        })
    }    
}

//middleware logintoken decode

const getUserEmail = async(req,res,next) => {
    let token  = req?.headers?.authorization?.split(' ')[1]
    if(token){
        let payload = await decodeLoginToken(token)
        req.user = payload
        // req.userEmail = payload.email
        // req.userid = payload.id
        next()        
    }else{
        res.status(500).send({
            message :"Expired Token"
        })
    }
}

//for resetpwd with id route
// const validateUserEmail = async(req,res,next) => {
//     let token  = req?.headers?.authorization?.split(' ')[1]
//     if(token){
//         let payload = await decodeLoginToken(token)
//         let email = payload.email
//         let id = payload._id
//         // console.log(email, id);
//         if(email && id){
//             next()
//         }        
//     }else{
//         res.status(500).send({
//             message :"Expired Token"
//         })
//     }
// }


export default {
    createHash,
    verifySalt,
    hashCompare,
    createLoginToken,
    createForgotPassToken,
    authenticate,
    userGuard,
    getUserEmail,
    // validateUserEmail
}