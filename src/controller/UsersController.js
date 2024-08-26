import RegisterLoginModel from '../models/registerLogin_Model.js'

const getNewFrds = async(req,res) => {
    try {
        const getusers = await RegisterLoginModel.find()
        if(getusers){
            res.status(200).send({
                message:"my frds fetched",
                getusers
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error in getting all users"
        })
    }
}

const getUsersBday = async(req,res) => {
    if(req.params.id){
        try {
            const getusers = await RegisterLoginModel.find()
            res.status(200).send({
                message:"users fetched",
                getusers
            })
        } catch (error) {
            res.status(500).send({
                message:"Internal Server Error in getting all users"
            })
        }
    }else{
        res.status(500).send({
            message : "Something went wrong in fetching all users"
        })
    }
}

const addFriend = async(req,res) => {
    if(req.params.id !== req.params.friendId){
        try {
            const user = await RegisterLoginModel.findById({_id : req.params.id})
            if(user){
                if (user.friends.includes(req.params.friendId)) {
                    res.status(400).send({
                        message:"Can't follow the same user twice"
                    })
                }else{
                    const addFriendInUser = await RegisterLoginModel.findByIdAndUpdate({_id:req.params.id},{$push : {friends : {userId : req.params.friendId}}})
                    const addFriendInFriend = await RegisterLoginModel.findByIdAndUpdate({_id:req.params.friendId},{$push : {friends : {userId : req.params.id}}})
                    res.status(200).send({
                        message:"Friend Added",
                        addFriendInUser,
                        addFriendInFriend
                    })
                }
            }else{
                res.status(400).send({
                    message:"User Not found"
                })
            }
        } catch (error) {
            res.status(500).send({
                message:"Internal Server Error in adding friends"
            })
        }
    }else{
        res.status(400).send({
            message:"FriendId & UserID are same"
        })
    }
}

const removeFriend = async(req,res) => {
    if(req.params.id !== req.params.friendId){
        try {
            const user = await RegisterLoginModel.findById({_id : req.params.id})
            if(user){
                if (user.friends.includes(req.params.friendId)) {
                    res.status(400).send({
                        message:"Can't unfollow someone you don't follow in the first place"
                    })
                }else{
                    const removeFriendInUser = await RegisterLoginModel.findByIdAndUpdate({_id:req.params.id},{$pull : {friends : {userId : req.params.friendId}}})
                    const removeFriendInFriend = await RegisterLoginModel.findByIdAndUpdate({_id:req.params.friendId},{$pull : {friends : {userId : req.params.id}}})
                    res.status(200).send({
                        message:"Removed Friend",
                        removeFriendInUser,
                        removeFriendInFriend
                    })
                }
            }else{
                res.status(400).send({
                    message:"User Not found"
                })
            }
        } catch (error) {
            res.status(500).send({
                message:"Internal Server Error in removing friends"
            })
        }
    }else{
        res.status(400).send({
            message:"FriendId & UserID arent same"
        })
    }
}

const getMyFriends = async(req,res) => {
    try {
        const user = await RegisterLoginModel.findById({_id : req.params.id})
        if(user){
            const myFriendsList = await Promise.all(
                user.friends.map((e) => {
                    return RegisterLoginModel.findById(e.userId).select("-password")
                })
            )
            // console.log(myFriendsList, "hi")
            if (myFriendsList.length > 0) {
                res.status(200).send({
                    message:"my frds fetched",myFriendsList
                })
            }else{
                res.status(400).send({
                    message : "No friends found"
                })
            }
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error in getting myfrds"
        })
    }
}

const getMyOnlineFriends = async(req,res) => {
    try {
        const user = await RegisterLoginModel.findById({_id : req.params.id})
        if(user){
            const myFriendsList = await Promise.all(
                user.friends.map((e) => {
                    return RegisterLoginModel.findById(e.userId).select("-password")
                })
            )
            if (myFriendsList.length > 0) {
                res.status(200).send({
                    message:"my frds fetched",myFriendsList
                })
            }
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error in getting myfrds"
        })
    }
}

export default{
    addFriend,
    removeFriend,
    getNewFrds,
    getMyFriends,
    getUsersBday,
    getMyOnlineFriends
}