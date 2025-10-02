const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'InaYoga'
        });
        console.log('Conectado a MongoDB Atlas');
    } catch (err) {
        console.error('Error de conexión a MongoDB:', err);
    }
};

module.exports = connectDB;