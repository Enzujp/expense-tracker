const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
    try {
        const dbURI = process.env.DBURI;
        await mongoose.connect(dbURI)
        .catch((error) => {
            console.log(error)})
        console.log(`Connected to the database on port ${PORT}`);
    } catch (error) {
        console.log(error);
        return error;
    }
}


module.exports = connectDB;