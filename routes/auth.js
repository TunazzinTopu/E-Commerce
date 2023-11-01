
const router = require('express').Router();
const bcrypt = require('bcrypt');
const user = require('../db_models/user').User;
const jwt = require('jsonwebtoken');

router.post('/signup',async (req,res)=>{
    try{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.pass,salt);
    const fetchUser = {
        username:req.body.username,
        email:req.body.email,
        pass: hash
    }
     const newuser = new user(fetchUser);
     const found = await user.findOne({email:req.body.email});
     if(found){
        res.json({success:false,message:"User already exists"});
        return;
     }
     await newuser.save();
     const {pass,...data}=newuser._doc;
     res.json({success:true,message:"User signup Successfull",user:data});
     return;
    }catch(err) {
        console.log(err);
    }
})

router.post('/login',async (req,res)=>{
    const email = req.body.email;
    const pass = req.body.pass;
    const username = req.body.username;
    if(email) {
     const found = await user.findOne({email:email});
     if(found){
       const passmatch = await bcrypt.compare(pass,found.pass);
       if(passmatch){
        const accesstoken=jwt.sign({
            id:found._id,
            isAdmin:found.isAdmin
        },process.env.JWT_SECRET_KEY,
        {expiresIn:'3d'});
        console.log(typeof(accesstoken));
       await found.updateOne({$push:{tokens:accesstoken}});
       const {pass,...data} = found._doc;
        res.json({success:true,message:"welcome",data:data});
        return;
       } else {
        res.json({success:false,message:"Wrong credentials!"});
        return;
       }
     }
     else{
      res.json({success:false,message:"user does not exits!"});
      return;
     }
    }
  
    if(username) {
         const found = await user.findOne({username:username});
         if(found) {
            const passmatch = await bcrypt.compare(pass,found.pass);
            if(passmatch) {
                const accesstoken = jwt.sign({
                    id:found._id,
                    isAdmin:found.isAdmin
                },process.env.JWT_SECRET_KEY
                ,{expiresIn:"3d"})

                const {pass,...data} = found._doc;
                await found.updateOne({$push:{tokens:accesstoken}});
                res.json({success:true,message:"welcome",data:data});
                return;
            } else {
                res.json({success:false,message:"Wrong credentials!"});
                return;
            }
         } else{
            res.json({success:false,message:"user does not exits!"});
            return;
         }
    }

})




module.exports={router};
