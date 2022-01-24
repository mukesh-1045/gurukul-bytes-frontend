const users = require("../models/userInfo");

module.exports = {
  getAllUser: async (req, res) => {
    if (req.authenticated) {
      const allUser = await users.find({ role: "user" });
      if (!allUser) {
        res.status(201).send({ message: "Database is Empty", status: true });
      } else {
        res.status(201).send({ message: "Users", status: true, allUsers: allUser });
      }
    } else {
      res.status(400).send({ error: "Not Authenticated", status: false });
    }
  },
  getUser: async (req, res) => {
    console.log("req ", req)
    if (req.authenticated) {
      const user = await users.findById(req.userId);
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