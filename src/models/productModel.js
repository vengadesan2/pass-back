import mongoose from './indexModel.js';


const datasSchema = new mongoose.Schema({
    name : {
        type : String
    },
    price : {
        type : String,
        required : false
    },
    description : {
        type : String,
        required : false
    },
    ratings:{
        type : String,
        required : false
    },
    images: [
        {
      image: {
            type: String,
            }
        }
    ],
    catageory: {
        type: String,
        required : false
    }, 
    seller: {
        type: String,
        required : false
    }, 
    stock:{
        type:Number,
        required : false
    },
    numOfReviews:{
        type:Date,
        default:Date.now()
    },
    reviews: []
 
},
{
    collection:'productModel',
    versionKey:false,
})

const productModel = mongoose.model('productModel', datasSchema)

export default productModel 