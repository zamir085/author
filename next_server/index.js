const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const AutorSchema = new mongoose.Schema({
  fullName: String,
  birthYear: Number,
  bio: String,
  imgURL: String, 
  genre: String,
  gender: String,
  isDead: Boolean,
});
const AutorModel = mongoose.model("Autor", AutorSchema);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + file.originalname) 
  }
})
var upload = multer({ storage: storage })

app.get("/api/autors", async (req, res) => {
  const { username } = req.query;
  const users = await AutorModel.find({});
  
  if (username) {
    const filteredUsers = users.filter((x) =>
      x.username.toLowerCase().trim().includes(username.toLowerCase().trim())
    );
    res.send(filteredUsers);
  } else {
    res.send(users);
  }
});

app.get("/api/autors/:id", async (req, res) => {
  const { id } = req.params;
  const user = await AutorModel.findById(id);
  if (user) {
    res.status(200).send(user);
  } else {
    res.send({ message: "not found" });
  }
});

app.get("/api/autors/imgURLs", async (req, res) => {
  try {
    const imgURLs = await AutorModel.find().select('imgURL');
    res.status(200).json(imgURLs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/autors", upload.single("imgFile"), async (req, res) => {
  try {
    const { fullName, birthYear, bio, genre, gender, isDead } = req.body;

    const imgURL = `/uploads/${req.file.filename}`;

    const newUser = new AutorModel({
      fullName,
      birthYear,
      bio,
      genre,
      gender,
      isDead,
      imgURL,
    });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.patch("/api/autors/:id", async (req, res) => {
  const { id } = req.params;
  await AutorModel.findByIdAndUpdate(id, req.body);
  const updatedUser = await AutorModel.findById(id);
  res.send(updatedUser);
});

app.delete("/api/autors/:id", async (req, res) => {
  const { id } = req.params;
  await AutorModel.findByIdAndDelete(id);
  const user = await AutorModel.find();
  res.send(user);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
mongoose
  .connect(
    "mongodb+srv://zamir:o0AfWR1bYaN42Uy8@cluster0.ueysftl.mongodb.net/?retryWrites=true&w=majority",{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB!"));
