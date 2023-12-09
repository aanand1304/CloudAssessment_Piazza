const mongoose = require('mongoose')
const mySchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:50
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('users',mySchema)