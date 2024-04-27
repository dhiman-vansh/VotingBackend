const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Candidate = require("./models/Candidate");
const app = express();
const namelist = require("./models/namelist.json");
const namesArray = namelist.map(item => item.name)


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

// app.post("/", async(req, res) => {
//     const candidate = new Candidate({
//       name: req.body.name,
//       img: req.body.img,
//       description: req.body.description,
//     });
  
//     try {
//       const newCandidate = await candidate.save();
//       res.status(201).json(newCandidate);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
// });

app.put("/:sr", async(req, res) => {

  const srNo = req.params.sr;
  const name = req.body.name;
  console.log(name, "in put");
  // const nameExists = checkIfNameExists(name, namesArray);
  if(namesArray.includes(name.toUpperCase())){
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
    console.log(candidateWithMaxVotes);
    // Calculate total number of votes cast
    const totalVotes = await Candidate.aggregate([
        { $group: { _id: null, totalVotes: { $sum: "$votes" } } }
    ]);

    // Calculate the percentage of votes the winning candidate received
    const percentageWin = (candidateWithMaxVotes[0].votes / totalVotes[0].totalVotes) * 100;

    res.json({
        name: candidateWithMaxVotes[0].name,
        img: candidateWithMaxVotes[0].img,
        percentageWin: percentageWin.toFixed(2) // Round to 2 decimal places
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
}
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
