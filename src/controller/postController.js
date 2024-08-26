import ProductModel from "../models/productModel.js"
import RegisterLoginModel from "./registerLogin_controller.js"

const home = async(req,res)=>{
    try {
        res.status(200).send({
            message:"homepage"
        })
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
}

const createPost = async(req,res) => {
    try {
        const postData = await ProductModel.create({...req.body,ownerName : req.user.name, ownerEmail : req.user.email, ownerID : req.user.id })
        if(postData){
            res.status(200).send({
                message:"Feed created",
                postData
            })
        }else {
            res.status(400).send({
                message: "Something went wrong!!!"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error in adding post"
        })
    }
}

const getProductdata = async(req,res) => {
    const query = req.query.keyword?{ name : { 
        $regex: req.query.keyword,
        $options: 'i'
     }}:{}
    try {
        const productData = await ProductModel.find(query)
        if(productData){
            res.status(200).send({
                message:"Feed created",
                productData
            })
        }else {
            res.status(400).send({
                message: "Something went wrong!!!"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error "
        })
    }
}

const getproductid = async(req,res) => {
    const data = req.params.id
    try {
        const getproductid = await ProductModel.findOne({_id :data})
        if(getproductid){
            res.status(200).send({
                message:"getpruduct id data fetch by id successful",
                getproductid
            })
        }else {
            res.status(204).send({
                message:"No product available",
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error in getting Userposts"
        }) 
    }
    
}

const updatePost = async(req,res) => {
    try {
        const {feededData,imageUrl} = req.body
        let postToBeUpdate = await ProductModel.findOneAndUpdate({_id : req.params.postId},{$set : {"feededData" : feededData, "imageUrl" : imageUrl }})
        res.status(200).send({
            message:"Post Updated",
            postToBeUpdate
        })
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error in updating Userposts"
        }) 
    }
}

const deleteUserPost = async(req,res) => {
    try {
        let postToBeDeleted = await ProductModel.findOneAndDelete({_id:req.params.id})
        res.status(200).send({
            message:"Post deleted please refresh",
            postToBeDeleted,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ 
            message:"Internal Server Error"
        })
    }
}

// const updatePostLikeStatus = async(req,res) => {
//     try {
//         let postToBeReacted = await ProductModel.findOneAndUpdate({_id:req.params.id},[ { "$set": { "currentLikeStatus": { "$eq": [false, "$currentLikeStatus"] } } } ])
//         res.status(200).send({
//             message:"Post reaction updated",
//             postToBeReacted,
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             message:"Internal Server Error"
//         })
//     }
// }

export default {
    home,
    createPost,
    getProductdata,
    getproductid,
    deleteUserPost,
    updatePost,
    // updatePostLikeStatus
}