const express = require('express');
const app = new express.Router();
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser");
const { check, body, validationResult } = require('express-validator');
const users = require("../models/userInfo");
const {createTokens , validateToken} = require("../middlewares/JWT");

const saltRounds = bcrypt.genSaltSync(10);

app.use(cookieParser());

app.post("/register",
  [
    check("dateOfBirth", "Please Enter a Valid firstName"),
    check("firstName", "Please Enter a Valid firstName")
      .not()
      .isEmpty(),
    check("lastName", "Please Enter a Valid lastName")
      .not()
      .isEmpty(),
    check("address", "Please Enter a Valid address")
      .not()
      .isEmpty(),
    check("role", "Please Enter a Valid role")
      .not()
      .isEmpty(),
    check("gender", "Please Enter a Valid gender")
      .not()
      .isEmpty(),
    check("emailId", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
     })
  ], 
  (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    let userDetails = req.body;
    userDetails.password = bcrypt.hashSync(userDetails.password,saltRounds);
    const user = new users(userDetails);
    user.save().then((result)=>{
      console.log("user is saved " + result);
      res.status(201).send({message:"User is saved ", status:true});
    }).catch((err)=>{
      console.log("error while saving user " + err);
      res.status(400).send({message:"User failed to be saved cause email already exists", status:false});
    });
  }
);


app.post("/login",
  [
    check("emailId", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req,res)=>
  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    console.log(" req body ", req.body);
    const {emailId , password} = req.body;
    console.log("email" + emailId);
    const user = await users.findOne({emailId:emailId});
    console.log("user that found " + user);
    if(!user){
      res.status(400).send({error:"User doesn't exists", status:false});
    }else{
      const dbPassword = user.password;
      if (bcrypt.compareSync(password, dbPassword)) {
        const accessToken = createTokens(user);
        res.cookie("access-token",accessToken,{
          maxAge: 60*60*24*30*1000,
          httpOnly: true,
        });
        res.status(201).send({message:"loged in", status:true});
      } else {
        res.status(400).send({error:"User email and password combination doesn't match" , status: false});
      }
    }
  }
);

app.get("/profile",validateToken,async (req,res)=>{
  if(req.authenticated){
    console.log(" id of user is " , req.userId);
    const user = await users.findById(req.userId);
    if(!user){
      res.status(400).send({error:"Cannot find a user with given ID" , status: false});
    }else{
      res.status(201).send({status:true , message:"User Info" , userData : user});
    }
  }else{
    res.status(400).send({error:"Not Authenticated" , status: false});
  }
});

app.get("/getAllUser",validateToken ,async(req,res)=>{
  if(req.authenticated){
    const allUser = await users.find({role:"user"});
    if(!allUser){
      res.status(201).send({message:"Database is Empty" , status: true});
    }else{
      res.status(201).send({message:"Users" , status: true , allUsers : allUser});
    }
  }else{
    res.status(400).send({error:"Not Authenticated" , status: false});
  }
})

module.exports = app;