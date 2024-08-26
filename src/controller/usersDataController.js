import RegisterLoginModel from '../models/registerLogin_Model.js'

const addUsersData = async(req,res) => {
    try {
        const addDatas = await RegisterLoginModel.findOneAndUpdate(
            {_id:req.user.id},
            {$set : {"imageDP" : req.body.imageDP, "bio" : req.body.bio, "dob" : req.body.dob}
        })
        if(addDatas){
            res.status(200).send({
                message:"users datas added",
                addDatas
            })
        }else {
            res.status(400).send({
                message: "error is storing userDatas"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error in adding userbiodata"
        })
    }
}

const getUsersData = async(req,res) => {
    try {
        const getData = await RegisterLoginModel.findOne({_id:req.params.id})
        if(getData === null){
            res.status(204).send({
                message:"No Bio Found"
            })
        }else{
            res.status(200).send({
                message:"UserDatas data fetch by id successful",
                getData
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error in getting userbiodata"
        })
    }
}

export default {
    addUsersData,
    getUsersData
}