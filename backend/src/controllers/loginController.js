const bcrypt = require("bcryptjs")
const {validationResult } = require('express-validator');
const users = require("../models/userInfo");
const {createTokens} = require("../middlewares/JWT");

module.exports = {
  loginUser : async (req,res)=>
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
  },
}