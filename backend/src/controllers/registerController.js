const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
const users = require("../models/userInfo");

const saltRounds = bcrypt.genSaltSync(10);

module.exports = {
  saveUser : (req,res)=>{
    console.log("req body " , req.body);
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
  },
}
