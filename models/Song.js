const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    _id: {
      type:mongoose.Schema.Types.ObjectId,
      auto: true, 
    }, 

  title: {
    type: String,
    required: true,
  },
  imgUrl:{
    type: String,
    required: true,
  },
  
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  },
});

module.exports = mongoose.model('Song', songSchema);
