const express = require('express');
const router = express.Router();
const getcontent = require("../getContent.improved")

router.use( timelog = (req,res,next) => {
    console.log(`Time ${Date.now()}`);
    next();
});

router.get("/", async (req, res) => {
  try {
    let result = await getcontent();
    if(result.apiValid === false){
      res.status(500).json({ error: result.error });
    } else {
      res.render("index", {
        data: result,
      });
    }
  } catch (error) {
    console.log(`error is ${error}`)
    res.status(500).json({ error: "message", log: error });
  }
  
});

// router.get("/api", cors(), (req, res) => {
router.get("/api", async (req, res) => {
  try {
    let result = await getcontent();
    if(result.apiValid === false){
      res.status(500).json({ error: result.error });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(`error is ${error}`)
    res.status(500).json({ error: "message", log: error });
  }
});

module.exports = router;
