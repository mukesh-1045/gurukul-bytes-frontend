const mongoose = require('mongoose');
const schema = mongoose.Schema;


var users = new schema({
    firstName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        required: true
    },
    address: {
      detail: {
        type: String,
        required: true
      },
      country:{
        type:String,
        required: true
      },
      state:{
        type:String,
        required: true
      },
      pincode:{
        type:String,
        required: true
      },
      city:{
        type:String,
        required: true
      },
      landmark:{
        type:String,
      },
    },
    gender: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);
var user = mongoose.model('user', users)
module.exports = user;