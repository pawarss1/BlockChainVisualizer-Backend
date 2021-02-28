const express = require("express");
const routes = express.Router();
routes.use(express.json()); // added body key to req
const { blockDb } = require("../connector");
const Blockchain = require("../Blockchain");
const BlockchainUtil = new Blockchain();
const { getGenesisBlock } = require("../functionUtils");

const isNullOrUndefined = (val) => {
  return val === null || val === undefined || val === "";
};

const addNewBlock = async (blockLength, prevHash, text) => {
  const newBlockResponse = BlockchainUtil.mine({
    nextIndex: blockLength,
    prevHash: prevHash,
    text: text,
  });
  if (newBlockResponse.success) {
    const newBlock = newBlockResponse.newBlock;
    const newBlockDbRes = new blockDb({
      index: newBlock.index,
      hash: newBlock.hash,
      previousHash: newBlock.previousHash,
      timestamp: newBlock.timestamp,
      data: newBlock.data,
      nonce: newBlock.nonce,
    });
    await newBlockDbRes.save();
    return newBlockDbRes;
  }
  return null;
};

routes.get("/blockchain", async (req, res) => {
  try {
    const blocks = await blockDb.find();
    //If no block is added yet, that means add a genesis block by default
    if (blocks.length === 0) {
      latestBlock = getGenesisBlock();
      prevHash = "0";
      const genesisBlock = addNewBlock(
        blocks.length,
        prevHash,
        "Welcome to Blockchain Demo 2.0!"
      );
      if (isNullOrUndefined(genesisBlock)) {
        res.send({
          success: false,
          blocks: [],
        });
        return;
      }
      res.send({
        success: true,
        blocks: [genesisBlock],
      });
      return;
    }
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
    let blocks = await blockDb.find();
    let latestBlock = blocks[blocks.length - 1];
    let prevHash = latestBlock.hash;

    const text = req.body.text;
    const newBlockResponse = await addNewBlock(blocks.length, prevHash, text);
    
    if (!isNullOrUndefined(newBlockResponse)) {
      blocks.push(newBlockResponse);
      res.send({
        success: true,
        blocks,
      });
    } else {
      res.send({
        success: false,
        blocks: [],
      });
    }
    return;
  } catch (err) {
    res.send({
      success: false,
      blocks: [],
    });
  }
});
module.exports = routes;
