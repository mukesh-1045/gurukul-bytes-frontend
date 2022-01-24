const express = require('express');
const app = new express.Router();
const cookieParser = require("cookie-parser");
const { check } = require('express-validator');
const { validateToken } = require("../middlewares/JWT");

const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const userController = require("../controllers/userController");


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
  registerController.saveUser
);


app.post("/login",
  [
    check("emailId", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  loginController.loginUser
);

app.get("/profile", validateToken, userController.getUser);
app.get("/logout", validateToken, loginController.logout);
app.get("/getAllUser", validateToken, userController.getAllUser);

module.exports = app;