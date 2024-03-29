const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');


app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/ecommerce');

// API Creation

app.get("/",(req,res)=>{
res.send("Express App is running")
});



// Image Storage Engine

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
 const upload = multer({storage:storage});

 //Creating Upload Endpoint for image
 app.use('/images',express.static('upload/images'))

 app.post("/upload",upload.single('product'),(req,res)=>{
res.json({
    success:1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
})
 })

 const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },

 });

 app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id=1;   
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("Product Saved");
    res.json({
        success:true,
        name:req.body.name

    })
 });

 //creating API for deleting the product

 app.post('/removeproduct', async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
 })

 // Creating Api for getting all product

 app.get('/allproducts', async (req,res)=>{
let products = await Product.find({});
console.log("All Products Fetched");

res.send(products)
 })


 //Schema creating for User model
 
 const User = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,

    },
    cartData:{
        type:Object,

    },
    date:{
        type:Date,
        default:Date.now
    }
 })


 //creating the API for register User


 app.post('/signup',async(req,res)=>{
    let check =await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, error:"existing user found with same email"})
    }
    let cart={};
    for(let i=0; i < Array.length; i++){
        cart[i]=0
    }
    const user = new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart

    })
    await user.save();

    const data ={
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
 });


 //creating API for user Login

 app.post('/login',async (req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(user){
        const passComapre = req.body.password === user.password;

        if(passComapre){
            const data={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,message:"Login Successfully..!",token});
        }else{
            res.json({success:false,error:"wrong password"})
        }
    }else{
        res.json({success:false,error:"wrong email id"})
    }
 });

//middleware to fetch user

const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next()
        }catch (error){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
    }
}
//APi for newcollections data

// app.get('/newcollection',(req,res)=>{

// })

 // API for addtocart
 app.post('/addtocart',fetchUser,async (req,res)=>{

    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;

    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
 })

//API for remove product from cartdata

app.post('/removefromcart',fetchUser, async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;

    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed");
})

app.listen(port,(error)=>{
if(!error){
    console.log("Server Running on Port:"+port)
}else{
    console.log("Error:"+error)
}
})
