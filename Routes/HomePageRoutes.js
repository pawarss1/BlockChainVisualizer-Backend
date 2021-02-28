const express = require("express");
const routes = express.Router();
routes.use(express.json()); // added body key to req
const { blockDb } = require("../connector");

const isNullOrUndefined = (val) => {
  return val === null || val === undefined || val === "";
};

routes.get("/blockchain", async (req, res) => {
  try {
    const blocks = await blockDb.find();
    res.send({
      success: true,
      blocks,
    });
    return;
  } catch (err) {
    res.send({ blocks: [], success: false });
  }
});

routes.post("/blockchain", async (req, res) => {
  try {
    
    const newBlock = new blockDb({
      data: req.body.data,
      prevHash: req.body.prevHash,
      hash: req.body.hash,
      nonce: req.body.nonce,
      timeStamp: req.body.timeStamp,
    });
    await newBlock.save();
    res.send({
      success: true,
    });
    return;
  } catch (err) {
    res.send({
      success: false,
    });
  }
});
module.exports = routes;
