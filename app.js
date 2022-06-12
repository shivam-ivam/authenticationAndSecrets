//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser")
const ejs=require("ejs");
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
  
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET , encryptedFields:['password']}); 

const User=new mongoose.model("User",userSchema);

////////////////////home////////////////////

app.route("/")
.get(function(req,res){
    res.render("home");
});

 ////////////////// login///////////////////

app.route("/login")
.get(function(req,res){
    res.render("login");
})
.post(function(req,res){
    User.findOne({email:req.body.username},function(err,foundUser){
        if(!err){
            if(foundUser.password===req.body.password){
                res.render("secrets");
            }
        }else{
            console.log(err);
        }
    });
});

////////////////// register////////////////

app.route("/register")
.get(function(req,res){
    res.render("register");
})
.post(function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }else{
            console.log(err);
        }
    });
});


/////////////////server////////////////////////


app.listen(3000,function(){
    console.log("surver is running at port 3000")
})