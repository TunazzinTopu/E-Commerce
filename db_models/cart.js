const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    products:[
        {
            productId:{type:String},
            quantity:{Number,default:1}
        }
    ]
},{timestamps:true});

const Product=mongoose.model('Product',productSchema);
module.exports={Product};