const express = require('express');
const router = express.Router();
const { createComment, getCommentsByEvent } = require('../controllers/commentControllers');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createComment); 
router.get('/event/:eventId', getCommentsByEvent);

// Crear un comentario en un evento
router.post('/', async (req, res) => {
    try {
        const { content, event, author } = req.body;
        const comment = new Comment({ content, event, author });
        await comment.save();
        res.status(201).json({ message: 'Comentario agregado exitosamente', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar comentario', error });
    }
});

// Obtener comentarios de un evento específico
router.get('/event/:eventId', async (req, res) => {
    try {
        const comments = await Comment.find({ event: req.params.eventId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comentarios', error });
    }
});

module.exports = router;
