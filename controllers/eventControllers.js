const Event = require('../models/event');
const jwt = require('jsonwebtoken');

// Crear un nuevo evento
const createEvent = async (req, res) => {
    try {
        // Obtén el token de autenticación desde las cabeceras
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        // Verifica y decodifica el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("decoded :",decoded);
        const creator = decoded.id; // Suponiendo que el ID del usuario está en el campo `id` del token

        const { title, description, date, location } = req.body;

        // Crea el evento con el creador asignado desde el token
        const event = new Event({ title, description, date, location });
        await event.save();

        // Emite una notificación del nuevo evento a todos los usuarios conectados
        const io = req.app.get('socketio'); // Obtiene la instancia de Socket.IO del servidor
        io.emit('newEvent', {
            message: `Nuevo evento creado: ${event.title}`,
            event
        });

        res.status(201).json({ message: 'Evento creado exitosamente', event });
    } catch (error) {
        // Si el error está relacionado con la autenticación
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        res.status(500).json({ message: 'Error al crear evento', error });
    }
};

// Obtener todos los eventos
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos', error });
    }
};

// Obtener un evento por ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el evento', error });
    }
};

module.exports = { createEvent, getEvents, getEventById };
