const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    _id: {
      type:mongoose.Schema.Types.ObjectId,
      auto: true, 
    },  
  name: {
    type: String,
    required: true,
  },
  genre:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  }, 
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
  }],
  
});

module.exports = mongoose.model('Artist', artistSchema);
