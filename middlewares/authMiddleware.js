const { verificarJWT } = require('../utils/jwt.js');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("Authorization Header en middleware:", authHeader);


    const token = authHeader.split(' ')[1];

    console.log("tokeeeeen:",token)
    if (!token) {
        console.log("Token no encontrado en el encabezado");
        return res.status(401).json({ message: 'Acceso denegado. No hay token' });
    }

    try {
        const decoded = verificarJWT(token); // Utiliza la función del archivo jwt.js
        req.user = decoded;
        console.log("Token decodificado exitosamente:", decoded);
        next();
    } catch (error) {
        console.error("Error en la verificación del token:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        } else {
            return res.status(400).json({ message: 'Token no válido' });
        }
    }
};

module.exports = authMiddleware;
