import mongoose from './indexModel.js';


const datasSchema = new mongoose.Schema({
    cartItem:{
        type:Array
     },
    amount: {
      type : Number
     },
     status: {
         type : Boolean
        },
     createdAt:{
         type:Date,
         default:Date.now()
     } 
},
{
    collection:'order',
    versionKey:false,
})

const orderModel = mongoose.model('order', datasSchema)

export default orderModel 