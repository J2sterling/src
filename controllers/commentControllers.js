const Comment = require('../models/comment');

// Crear un comentario en un evento
const createComment = async (req, res) => {
    try {
        const { content, event, author } = req.body;
        const comment = new Comment({ content, event, author });
        await comment.save();

        // Emite una notificación del nuevo comentario a todos los usuarios conectados en la sala del evento
        const io = req.app.get('socketio'); // Obtiene la instancia de Socket.IO del servidor
        io.to(event).emit('newComment', {
            message: `Nuevo comentario en el evento ${event}`,
            comment
        });

        res.status(201).json({ message: 'Comentario agregado exitosamente', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar comentario', error });
    }
};

// Obtener comentarios de un evento específico
const getCommentsByEvent = async (req, res) => {
    try {
        const comments = await Comment.find({ event: req.params.eventId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comentarios', error });
    }
};

module.exports = { createComment, getCommentsByEvent };
