const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById } = require('../controllers/eventControllers');
const authMiddleware = require('../middlewares/authMiddleware');
const Event = require('../models/event');

router.get('/test-auth', authMiddleware, (req, res) => {
    res.json({ message: 'Token válido. Autenticación exitosa.', user: req.user });
});
router.post('/', authMiddleware, createEvent);  // Proteger la creación de eventos
router.get('/', authMiddleware, getEvents);     // Proteger la obtención de todos los eventos
router.get('/:id', authMiddleware, getEventById); // Proteger la obtención de un evento específic

router.post('/api/events', async (req, res) => {
    try {
        const { title, description, date, location } = req.body;
        const newEvent = new Event({ title, description, date, location });
        await newEvent.save();
        console.log("Llega aqui")
        res.status(201).json({ message: 'Evento creado con éxito' });
    } catch (error) {
        console.error('Error al crear el evento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Crear un nuevo evento
router.post('/', async (req, res) => {
    try {
        const { title, description, date, location, creator } = req.body;
        const event = new Event({ title, description, date, location, creator });
        await event.save();
        res.status(201).json({ message: 'Evento creado exitosamente', event });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear evento', error });
    }
});

// Obtener todos los eventos
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos', error });
    }
});

// Obtener un evento específico por ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }
});

module.exports = router;
