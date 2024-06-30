

const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://apoorv17250:meeshu03@cluster0.onqswlm.mongodb.net/?retryWrites=true&w=majority");

        console.log(`Mongo DB Connected ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;