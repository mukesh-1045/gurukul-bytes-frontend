const users = require("../models/userInfo");

module.exports = {
  // function to send all user for admin login
  getAllUser: async (req, res) => {
    if (req.authenticated) {
      const allUser = await users.find({ role: "user" });   // getting all user 
      if (!allUser) {
        res.status(201).send({ message: "Database is Empty", status: true });
      } else {
        res.status(201).send({ message: "Users", status: true, allUsers: allUser });
      }
    } else {
      res.status(400).send({ error: "Not Authenticated", status: false });
    }
  },

  // function for sending a single user info
  getUser: async (req, res) => {
    if (req.authenticated) {
      const user = await users.findById(req.userId);   // getting user data from db using users's email
      if (!user) {
        res.status(400).send({ error: "Cannot find a user with given ID", status: false });
      } else {
        res.status(201).send({ status: true, message: "User Info", userData: user });
      }
    } else {
      res.status(400).send({ error: "Not Authenticated", status: false });
    }
  },
}