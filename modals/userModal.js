const mongoose = require("mongoose")

const userSchema  = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:false
    },
    email:{
        type:String,
        require:true,
        unique:true,
        match: /^\S+@\S+\.\S+$/ 
    },
    password:{
        type:String,
        require:true,
        unique:false
    },
    phone:{
        type:String,
        unique:true
    },
    passwordResetToken:{
        type:String
    },
    passwordResetTokenExpire:{
        type:Date
    }
})

module.exports = mongoose.model("users",userSchema)
