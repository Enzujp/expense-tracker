const mongoose = require("mongoose");
const { isEmail } = require("validator")

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: [true, "Please enter your username"],
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "please enter your email"],
        validator: [isEmail, "Please enter a valid email address"]

    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Enter a password longer than 5 characters"]
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    transactions: {
        type: []
    }
    
},
 { tinestamps: true 
}
);


const User = mongoose.model('user', userSchema);


module.exports = { User }