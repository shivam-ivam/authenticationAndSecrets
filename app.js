//jshint esversion:6
// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

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


        console.log(res);
        User.findOne({ email: req.body.username }, function (err, foundUser) {
            if (!err) {
                // if(foundUser.password===res){
                // res.render("secrets");
                // }
                bcrypt.compare(req.body.password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            } else {
                console.log(err);
            }
        });

    });

////////////////// register////////////////

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {

        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save(function (err) {
                if (!err) {
                    res.render("secrets");
                } else {
                    console.log(err);
                }
            });
        });


    });


/////////////////server////////////////////////


app.listen(3000, function () {
    console.log("surver is running at port 3000")
})