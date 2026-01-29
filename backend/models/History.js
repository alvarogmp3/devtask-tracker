const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    titulo: String,
    tecnologia: String,
    fechaEliminacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);