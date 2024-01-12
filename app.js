const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");


// routes
const authRoutes = require("authRoutes");

// port 

const PORT = process.env.PORT || 3000

// configs


// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());



// routes to use to handle requests
app.use("user", authRoutes);