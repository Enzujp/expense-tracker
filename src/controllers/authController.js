const User = require("../models/User");
const bcrypt = require("bcrypt");
const createToken = require("../../config/token");



module.exports.get_signup = (req, res) => {
    res.send("This is the signup page!")
}

module.exports.post_signup = async(req, res) => {
    
}


module.exports.get_login = (req, res) => {
    res.send("This is the login page!")
}

module.exports.post_login = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}
