const mongoose = require('mongoose');
const schema = mongoose.Schema;

// user info modal stores all information regards a user
var users = new schema({
    firstName: {   // first name 
        type: String,
        required: true
    },
    imageUrl: {    // profile picture url
        type: String
    },
    lastName: {   // last name 
        type: String,
        required: true
    },
    password: {  // hashed password
        type: String,
        required: true
    },
    dateOfBirth: {   // date of birth 
        type: Date,
        required: true
    },
    role: {   // role only admin or user
        type: String,
        required: true
    },
    emailId: {  // email
        type: String,
        unique: true,
        required: true
    },
    address: {  // address
        type: String,
        required: true
    },
    gender: {  // gender
        type: String,
        required: true
    },
    userCount: { // concurrent login count 
        type: Number
    }
},
    { timestamps: true }
);
var user = mongoose.model('user', users)
module.exports = user;

