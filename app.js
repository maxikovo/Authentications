//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _= require("lodash");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/SecretsDB");


const userSchema = new mongoose.Schema ({
  email:String,
  password:String
});



userSchema.plugin(encrypt,{secret:process.env.SECRET , encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);



app.get("/",function(req,res){
res.render("home");

});




app.get("/login",function(req,res){

res.render("login");

});

app.get("/register",function(req,res){
res.render("register");

});
app.post("/",function(req,res){


});

app.post("/register",function(req,res){

  const newUser = new User ({
    email: req.body.username,
    password:md5(req.body.password)

  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
    console.log(err);
    }

  });


});


app.post("/login",function(req,res){

User.findOne({
  email:req.body.username,
},function(err,foundUser){
  if(!err){
    if(foundUser){
      if(foundUser.password === md5(req.body.password) )
      res.render("secrets");
    } else {
      res.redirect("register");
    }
  } else {
    console.log(err);
  }

});


});





app.listen(3000,()=> console.log("Server is running on port 3000"));
