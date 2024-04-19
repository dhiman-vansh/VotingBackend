const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Candidate = require("./models/Candidate");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Vansh:Vansh@freelancing.ioxxoqc.mongodb.net/?retryWrites=true&w=majority&appName=FreeLancing"
  )
  .then(() => console.log("Connected!"));

app.get("/", async(req, res) => {
    const candidates =  await Candidate.find(); 
    res.json(candidates);
});
app.post("/", async(req, res) => {
    const candidate = new Candidate({
      name: req.body.name,
      img: req.body.img,
      description: req.body.description,
    });
  
    try {
      const newCandidate = await candidate.save();
      res.status(201).json(newCandidate);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
