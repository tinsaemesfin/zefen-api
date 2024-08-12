const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Song = require('./models/Song'); // Import the Song model
const Genre = require('./models/Genre');
const Artist = require('./models/Artist');
const Album = require('./models/Album');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a song
app.post('/songs', async (req, res) => {
  try {
    const song = new Song(req.body);
    const savedSong = await song.save();
    const populatedSong = await Song.findById(savedSong._id)
    .populate('genre')
    .populate('artist')
    .populate('album');
    res.status(201).json(populatedSong);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all songs
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find().populate('artist').populate('album').populate('genre');
    res.json({songs,msg:'GET /songs'});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific song
app.get('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a song
app.put('/songs/:id', async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    const populatedSong = await Song.findById(updatedSong._id)
    .populate('genre')
    .populate('artist')
    .populate('album');
    res.status(201).json(populatedSong);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a song
app.delete('/songs/:id', async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(deletedSong._id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// fetch all genres
app.get('/genres', async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// fetch all artists and populate with their albums and genres
app.get('/artists', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// fetch all albums and populate with their artist and genre
app.get('/albums', async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//  get request to /stastics and return the number of songs, artists, albums and genres
app.get('/statistics', async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtist = await Artist.countDocuments();
    const totalAlbum = await Album.countDocuments();
    const totalGenres = await Genre.countDocuments();
    res.json({totalSongs, totalArtist, totalAlbum, totalGenres});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// get /statics/artist/:id and return the number of songs, albums and genres for that artist
app.get('/statistics/artist/:id', async (req, res) => {
  
  try {
    const totalSongs = await Song.countDocuments({artist: req.params.id});
    const totalAlbums = await Album.countDocuments({artist: req.params.id});
    res.json({artistStat:{totalSongs, totalAlbums}});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/statistics/album/:id', async (req, res) => {
  
  try {
    const totalSongs = await Song.countDocuments({album: req.params.id});
    // below i want the uniqe total number of genres for the album we can get that by songs with the album id then those songs we count unique genre ids

    const totalGenresResult = await Song.aggregate([
      { $match: { album: new mongoose.Types.ObjectId(req.params.id) } },
      { $group: { _id: '$genre' } },
      { $count: 'uniqueGenresCount' }
    ]);
    const totalGenres = totalGenresResult.length > 0 ? totalGenresResult[0].uniqueGenresCount : 0;
    res.json({albumStat:{totalSongs, totalGenres}});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


