const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// routes
const authRoutes = require("./src/routes/authRoutes");

// port 

const PORT = process.env.PORT || 3000

// configs
require("dotenv").config();
require("./config/db");
connectDB();



// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());



// routes to use to handle requests
app.use("/user", authRoutes);


// test port 
app.get('/', (req, res)=> {
    res.send("Hii Enzu, I work!")
})

// connect
app.listen(PORT, ()=> {
    console.log(`Hi, connected app on port ${PORT}`)
})