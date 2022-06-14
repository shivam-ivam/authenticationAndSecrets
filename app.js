//jshint esversion:6
// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passportLocal=require("passport-local-mongoose");
const session =require("express-session");
const passport=require("passport");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(session({
    secret: "thereisasecret",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
// mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocal);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////////////////////home////////////////////

app.route("/")
    .get(function (req, res) {
        res.render("home");
    });

////////////////// login///////////////////

app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        const user=new User({
            username:req.body.username,
            password:req.body.password
        });
        req.login(user,function(err){
            if(err){
                console.log(err);
            }else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/secrets");
                });
            }
        });
    });

////////////////// register////////////////

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {

        User.register({username:req.body.username},req.body.password,function(err,user){
            if(err){
                console.log(err);
                res.redirect("/register");
            }else{passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });

            }
        });
    });

//////////////secrete////////////////////

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

//////////////logout///////////////////

app.get("/logout",function(req,res){
    // req.logout();
    // res.redirect("/");
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

/////////////////server////////////////////////


app.listen(3000, function () {
    console.log("surver is running at port 3000")
})