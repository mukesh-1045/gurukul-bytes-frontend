const bcrypt = require("bcryptjs")
const { validationResult } = require('express-validator');
const users = require("../models/userInfo");
const { createTokens } = require("../middlewares/JWT");

module.exports = {
  // This function is for user login 
  loginUser: async (req, res) => {
    const errors = validationResult(req);  // get all errors that came from validating request 
    if (!errors.isEmpty()) {               //sending back response if any validation falis
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const { emailId, password } = req.body;
    const user = await users.findOne({ emailId: emailId });   // getting user with given email from DB
    if (!user) {
      res.status(201).send({ error: "User doesn't exists", status: false });  // if user not found 
    } else {
      let userData = await users.findOne({ emailId: emailId });  // if user found, we gets its all data
      const dbPassword = userData.password;
      if (bcrypt.compareSync(password, dbPassword)) {   // compare the hashed password 
        const accessToken = createTokens(userData);   // creating JWT token
        if (userData.userCount) {                     // check for concurrent login
          let newCount = userData.userCount + 1;
          if (newCount > 2) {             // response if more then 2 login request from 1 user
            res.status(201).send({ message: "You are activily loged in from 2 device, It is maximum limit", status: false, userCount: newCount });
          } else {
            await users.findByIdAndUpdate(userData._id, { $set: { userCount: newCount } });  // updating userCount that is concurrent login of 1 account 
            res.status(201).send({ message: "loged in", status: true, role: userData.role, accesstoken: accessToken });
          }
        } else {
          await users.findByIdAndUpdate(userData._id, { $set: { userCount: 1 } });
          res.status(201).send({ message: "loged in", status: true, role: userData.role, accesstoken: accessToken });
        }
      } else {     // resposne if password  does not match
        res.status(201).send({ error: "User email and password combination doesn't match", status: false });
      }
    }
  },

  // this function logout a user here we just match the user and reduce the userCount by 1.
  logout: async (req, res) => {
    if (req.authenticated) {
      const user = await users.findById(req.userId);
      let newCount = user.userCount - 1;
      await users.findByIdAndUpdate(req.userId, { $set: { userCount: newCount } });
      res.status(201).send({ message: "successful logout", status: true });
    } else {
      res.status(400).send({ error: "Not Authenticated", status: false });
    }
  },
}