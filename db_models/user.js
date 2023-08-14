const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true, max:20},
    email:{type:String,required:true,unique:true,max:50},
    pass:{type:String,required:true},
    isAdmin:{type:Boolean,default:false},
    tokens:{type:Array,default:[]}
},
{timestamp:true});
const User = mongoose.model('user',userSchema);
module.exports={User};