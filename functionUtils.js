const Block = require("./Block.js");

const getGenesisBlock = () => {
  return Block.genesis;
};
exports.getGenesisBlock = getGenesisBlock;
