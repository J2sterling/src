const jwt = require('jsonwebtoken');

/**
 * Función para generar un JWT
 * @param {string} uid - El ID del usuario
 * @param {string} name - El nombre del usuario
 * @returns {Promise<string>} - Retorna una promesa con el token generado
 */
const generarJWT = (uid, name) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name };
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h' // Tiempo de expiración del token
        }, (error, token) => {
            if (error) {
                console.log("Error al generar el token:", error);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

/**
 * Función para verificar y decodificar un JWT
 * @param {string} token - El token a verificar
 * @returns {Object} - Retorna el payload decodificado si el token es válido
 * @throws {Error} - Lanza un error si el token no es válido o ha expirado
 */
const verificarJWT = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verificado exitosamente 123 :", decoded);
        return decoded;
    } catch (error) {
        console.error("Error en la verificación del token:", error);
        throw error;
    }
};

module.exports = {
    generarJWT,
    verificarJWT
};
