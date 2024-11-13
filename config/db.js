const mongoose = require('mongoose');

const connectDB = async () => {
    console.log("DB_URL:", process.env.DB_URL); // Verifica que DB_URL tenga un valor
    try {
        await mongoose.connect(process.env.DB_URL); // Elimina las opciones obsoletas
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error de conexión:", error);
        process.exit(1); // Salir si no se conecta
    }
};

module.exports = connectDB;
