const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
require('dotenv').config();
const eventRoutes = require('./routes/eventRoutes');
require('./tasks/eventCleanupTask'); 

// Conectar a la base de datos
connectDB();

const app = express();
const server = http.createServer(app); // Crear el servidor HTTP para Socket.IO
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', // URL del frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
};
app.use(cors(corsOptions));
app.use(express.json());
console.log("JWT_SECRET en el servidor:", process.env.JWT_SECRET);
// Montar las rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/', eventRoutes);
// Configurar Socket.IO
app.set('socketio', io); // Permite acceder a Socket.IO desde cualquier controlador

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Unirse a una sala de evento específica
    socket.on('joinEvent', (eventId) => {
        socket.join(eventId);
        console.log(`Usuario ${socket.id} se unió a la sala del evento ${eventId}`);
    });

    // Escuchar mensajes del chat en la sala de eventos
    socket.on('chatMessage', (data) => {
        io.to(data.eventId).emit('chatMessage', data); // Envía el mensaje a todos en la sala del evento
    });

    // Notificaciones y otros eventos adicionales
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
