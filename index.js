const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Candidate = require("./models/Candidate");
const app = express();
const namelist = require("./models/namelist.json");
const namesArray = namelist.map(item => item.name)
console.log(namesArray)


function checkIfNameExists(nameToCheck, namesArray) {
  return namesArray.namelist(item => item.name === nameToCheck);
}


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

app.put("/:sr", async(req, res) => {

  const srNo = req.params.sr;
  const name = req.body.name;
  // const nameExists = checkIfNameExists(name, namesArray);
  if(namesArray.includes(name.toLowerCase())){
    res.send("PUT hit "+srNo+" "+name);
    
    try{
      const candidate = await Candidate.findOne({srNo:srNo});
      candidate.votes = candidate.votes + 1;
      await candidate.save();
      console.log(candidate);
    }
    catch(err){
      res.status(400).json("error in sending data");
    }

  }
  else {
    res.send("NameError");
  }

});

app.get("/reset", async(req, res) => {
  try{
    await Candidate.updateMany({}, {votes: 0});
    res.send("Reset Done");
  }
  catch(err){
    res.status(400).json("error in sending data");
  }
});

app.get("/results", async(req, res) => {
  try {
    // Find the candidate with the maximum number of votes
    const candidateWithMaxVotes = await Candidate.aggregate([
        { $sort: { votes: -1 } }, // Sort candidates by votes in descending order
        { $limit: 1 } // Get only the first candidate (with maximum votes)
    ]);

    res.json(candidateWithMaxVotes);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
}
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
