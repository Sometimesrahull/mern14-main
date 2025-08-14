const express = require('express');
const multer = require('multer');
const id3 = require("node-id3")
const uploadFile = require("../services/storage.service")
const songModel = require("../models/song.model");


const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/rahul', upload.single("audio"), async (req, res) => {
    const file = req.file;

    const tags = id3.read(file.buffer)

    const audio = await uploadFile(file.buffer, "audio")
  //  const coverImage = await uploadFile(tags.image.imageBuffer, "coverImage")
  let coverImage;
    if (tags.image) {
        coverImage = await uploadFile(tags.image.imageBuffer, "coverImage")
    } else {
        coverImage = { url: "https://via.placeholder.com/150" }; // Fallback image if no cover is found
    }

    if (!audio || !coverImage) {
        return res.status(400).json({ message: "File upload failed" });
    }

    const song = await songModel.create({
        title: tags.title,
        artist: tags.artist,
        album: tags.album,
        releaseDate: tags.year,
        audioUrl: audio.url,
        coverImage: coverImage.url
    })

    res.status(201).json({
        message: "Song created successfully",
        song
    });
})


router.get('/rahul', async (req, res) => {

    const songs = await songModel.find();

    res.status(200).json({
        message: "Songs fetched successfully",
        songs
    });

})

module.exports = router;