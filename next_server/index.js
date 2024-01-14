const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

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

const BookSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Autor" },
  coverImg: String,
  name: String,
  year: Number,
  genre: String,
  desc: String,
  bookFile: String,
});
const BookModel = mongoose.model("Book", BookSchema);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({ storage: storage });

var bookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isImage = file.mimetype.startsWith("image/");
    const isPDF = file.mimetype.startsWith("application/pdf");

    if (isImage) {
      cb(null, "bookCovers/");
    } else if (isPDF) {
      cb(null, "bookFiles/");
    } else {
      cb(
        {
          message:
            "Invalid file type. Only images (jpeg, png) and PDFs are allowed.",
        },
        null
      );
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var uploadBook = multer({ storage: bookStorage });

app.get("/api/autors", async (req, res) => {
  const { username } = req.query;
  const users = await AutorModel.find({});

  if (username) {
    const filteredUsers = users.filter((x) =>
      x.fullName.toLowerCase().trim().includes(username.toLowerCase().trim())
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
    const imgURLs = await AutorModel.find().select("imgURL");
    res.status(200).json(imgURLs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/autors", upload.single("imgFile"), async (req, res) => {
  try {
    const { fullName, birthYear, bio, genre, gender, isDead } = req.body;
    const imgURL = `http://localhost:8080/uploads/${req.file.filename}`;
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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.patch("/api/autors/:id", async (req, res) => {
  const { id } = req.params;
  await AutorModel.findByIdAndUpdate(id, req.body);
  const updatedUser = await AutorModel.findById(id);
  res.send(updatedUser);
});

app.delete("/api/autors/:id", async (req, res) => {
  const { id } = req.params;
  await AutorModel.findByIdAndDelete(id);
  await BookModel.deleteMany({ authorId: id });
  const user = await AutorModel.find({});
  res.send(user);
});

app.post(
  "/api/books",
  uploadBook.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { authorId, name, year, genre, desc } = req.body;
      const coverImg = `http://localhost:8080/bookCovers/${req.file.filename}`;
      const bookFile = `http://localhost:8080/bookFiles/${req.file.filename}`;
      const newBook = new BookModel({
        authorId,
        coverImg,
        name,
        year,
        genre,
        desc,
        bookFile,
      });

      await newBook.save();
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/api/books", async (req, res) => {
  try {
    const books = await BookModel.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/books", async (req, res) => {
  const { id } = req.params;
  const author_book = await BookModel.find({ author: id });
  res.send(author_book);
})

app.get("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const book = await BookModel.findById(id);
  if (book) {
    res.status(200).send(book);
  } else {
    res.send({ message: "not found" });
  }
});

app.patch("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  await BookModel.findByIdAndUpdate(id, req.body);
  const updatedBook = await BookModel.findById(id);
  res.send(updatedBook);
});

app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  await BookModel.findByIdAndDelete(id);
  const book = await BookModel.find();
  res.send(book);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

mongoose
  .connect(
    "mongodb+srv://zamir:o0AfWR1bYaN42Uy8@cluster0.ueysftl.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB!"));
