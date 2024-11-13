const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authControllers');
const { validateRegister } = require('../middlewares/validateData');


router.post('/register', register);
router.post('/login', login);

// Ruta para registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

// Ruta para login de usuario (ejemplo básico)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
});

module.exports = router;
