const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
const users = require("../models/userInfo");

const saltRounds = bcrypt.genSaltSync(10);

module.exports = {
  saveUser: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    let userDetails = req.body;
    userDetails.password = bcrypt.hashSync(userDetails.password, saltRounds);
    const user = new users(userDetails);
    user.save().then((result) => {
      res.status(201).send({ message: "User is saved ", status: true });
    }).catch((err) => {
      res.status(201).send({ message: "User failed to be saved cause email already exists", status: false });
    });
  },
}
