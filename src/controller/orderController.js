import orderModel from "../models/OrderModel.js";

const orderdata = async(req,res) => {
    try {
         const cartItem =req.body
         const amount = Number(cartItem.reduce((acc,item)=>(acc+item.product.price*item.qty),0)).toFixed(2)
        //  const status ="pending"
         let order = await orderModel.create({cartItem,amount})
        if(order){
            res.status(200).send({
                message : "User created successfully",
                order
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
export default{
  orderdata
}