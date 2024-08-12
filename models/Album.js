const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);