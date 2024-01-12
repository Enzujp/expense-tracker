const mongoose = require("mongoose");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const createToken = require("../../config/token");
const jwt = require("jsonwebtoken");

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
    const {username, password} = req.body;
    // check to see if user has an account 
    const user = await User.findOne({ username:username })
    if (!user) {
        res.status(400).json({
            message: "Invalid Credentials",
        })
    } else {
        // compare user password with hashed and log user in
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            const token = createToken(user._id)
            return res.status(200).json({
                message: "User signed in successfully",
                user: user,
                _token: token
            })
        } else {
            return res.status(401).json({
                message: "Unauthorized, incorrect password"
            })
        }
    } 


  } catch (error) {
    console.log(error)
    res.status(422).json({
        error: error.message,
        message: "Couldn't log you in at this time"
    })

  }; 
};

const verifyEmail = async (req, res) => {
    const verify_token = req.params.token;
    try {
        const payload = jwt.verify(verify_token,process.env.SECRET_KEY)

        if (!payload) {
            return res.status(400).json({
                success: false,
                error: error.message,
                message: "Invalid token provided"
            })
        } else {
            const user = await User.findOne({email: payload.email});

            if (user.emailVerified) {
                return res.status(400).json({
                    message: "User email already verified"
                })
            }
            user.emailVerified = true;
            await user.save();
            return res.status(200).json({
                message: "Email has been verified!"
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

