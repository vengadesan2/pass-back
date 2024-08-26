import mongoose from './indexModel.js'

const validateEmail = (email) => {
    return String(email).toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

const registerLoginSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required : [true,"FirstName is required"]
    },
    lastName:{
        type : String,
        required : [true,"LastName is required"]
    },
    email:{
        type : String,
        required:[true,"Email is required"],
        validate: {
            validator : validateEmail,
            message : props => `${props.value} is not a valid email`
        }
    },
    mobile:{
        type: String,
        required:[true,"Mobile number is required"]
    },
    password:{
        type: String,
        required:[true,"Password is required"]
    }, 
    forgotPassToken:{
        type : String,
        required:[false,"required"]
    }, 
    emailHash:{
        type:String,
        required:[false,"required"]
    },
    // randomString:{
    //     type: String,
    //     required:[false,"RandomString is required"]
    // },
    status:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},
{
    collection:'user',
    versionKey:false
})

const RegisterLoginModel = mongoose.model('user', registerLoginSchema)

export default RegisterLoginModel