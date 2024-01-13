const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// routes
router.get("/login", authController.get_login);
router.post("/login", authController.post_login);
router.get("/signup", authController.get_signup);
router.post("/signup", authController.post_signup);


module.exports = router;