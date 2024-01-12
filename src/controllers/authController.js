const mongoose = require("mongoose");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const createToken = require("../../config/token");

// create a general error function for signup


module.exports.get_signup = (req, res) => {
  res.send("This is the signup page!");
};

module.exports.post_signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // check for existing user
    const user = await User.findOne({ username: username });
    if (user) {
      res.status(409).json({
        message: "Username already taken, choose another",
      })
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: username,
        email: email,
        password: hashedPassword,
      })
      // create user token with email
      const token = createToken(user.email);
      await user.save();

      return res.status(201).json({
        message: "User successfully created",
        user: user._id,
        email: user.email,
        token: token,
        password: hashedPassword,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Sorry, couldn't sign you up at this time.",
    });
  }
};

module.exports.get_login = (req, res) => {
  res.send("This is the login page!");
};

module.exports.post_login = async (req, res) => {
  try { 
  } catch (error) {

  } 
};

