const bcrypt = require("bcryptjs")
const { validationResult } = require('express-validator');
const users = require("../models/userInfo");
const { createTokens } = require("../middlewares/JWT");

module.exports = {
  loginUser: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const { emailId, password } = req.body;
    const user = await users.findOne({ emailId: emailId });
    if (!user) {
      res.status(400).send({ error: "User doesn't exists", status: false });
    } else {
      let userData = await users.findOne({ emailId: emailId });
      const dbPassword = userData.password;
      if (bcrypt.compareSync(password, dbPassword)) {
        const accessToken = createTokens(userData);
        if (userData.userCount) {
          let newCount = userData.userCount + 1;
          if (newCount > 2) {
            res.status(201).send({ message: "You are activily loged in from 2 device, It is maximum limit", status: false, userCount: newCount });
          } else {
            await users.findByIdAndUpdate(userData._id, { $set: { userCount: newCount } });
            res.status(201).send({ message: "loged in", status: true, role: userData.role, accesstoken: accessToken });
          }
        } else {
          await users.findByIdAndUpdate(userData._id, { $set: { userCount: 1 } });
          res.status(201).send({ message: "loged in", status: true, role: userData.role, accesstoken: accessToken });
        }
      } else {
        res.status(400).send({ error: "User email and password combination doesn't match", status: false });
      }
    }
  },
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