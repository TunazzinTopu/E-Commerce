const express = require('express');
const helmet = require('helmet');
const morgan =  require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth').router;

dotenv.config();

const app = express();

//builtin middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(helmet());

//router middleware
app.use('/api/auth',authRouter);


mongoose
.connect(process.env.MONGO_URL)
.then(()=>{console.log('Server is connected...');})
.catch((err)=>{console.log(err)})
app.get('/',(req,res)=>{
    res.json({success:true,message:"Welcome to home page"});
    return;
}) 



app.all('*',(req,res)=>{
    res.json({status:false,message:"Url not found!"});
}) 

app.listen(5000,()=>{
    console.log(`Server is listening to port ${process.env.PORT} ...`);
})



