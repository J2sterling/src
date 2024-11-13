// src/tasks/eventCleanupTask.js
const cron = require('node-cron');
const Event = require('../models/event');

// Configura la tarea programada para que se ejecute cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
    console.log('Ejecutando limpieza de eventos antiguos cada 5 minutos...');
    try {
        const today = new Date();
        const result = await Event.deleteMany({ date: { $lt: today } });
        console.log(`Eventos antiguos eliminados: ${result.deletedCount}`);
    } catch (error) {
        console.error('Error al limpiar eventos antiguos:', error);
    }
});

