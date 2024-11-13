const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta de prueba para verificar token
router.get('/test-auth', authMiddleware, (req, res) => {
    res.json({ message: 'Token válido. Autenticación exitosa.', user: req.user });
});

module.exports = router;
