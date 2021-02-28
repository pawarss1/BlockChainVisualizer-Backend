const Block = require("./Block.js");
const crypto = require("crypto");

class Blockchain {
  constructor() {
    this.difficulty = 3;
  }

  isValidHashDifficulty(hash) {
    for (var i = 0; i < hash.length; i++) {
      if (hash[i] !== "0") {
        break;
      }
    }
    return i >= this.difficulty;
  }

  calculateHashForBlock(block) {
    const { index, previousHash, timestamp, data, nonce } = block;
    return this.calculateHash(index, previousHash, timestamp, data, nonce);
  }

  calculateHash(index, previousHash, timestamp, data, nonce) {
    return crypto
      .createHash("sha256")
      .update(index + previousHash + timestamp + data + nonce)
      .digest("hex");
  }

  mine(data) {
    const newBlock = this.generateNextBlock(data);
    try {
      return { newBlock, success: true };
    } catch (err) {
      throw {success: false};
    }
  }

  generateNextBlock(data) {
    const nextIndex = data.nextIndex;
    const previousHash = data.prevHash;
    let timestamp = new Date().getTime();
    let nonce = 0;
    let nextHash = this.calculateHash(
      nextIndex,
      previousHash,
      timestamp,
      data.text,
      nonce
    );

    while (!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1;
      timestamp = new Date().getTime();
      nextHash = this.calculateHash(
        nextIndex,
        previousHash,
        timestamp,
        data,
        nonce
      );
    }

    const nextBlock = new Block(
      nextIndex,
      previousHash,
      timestamp,
      data.text,
      nextHash,
      nonce
    );

    return nextBlock;
  }

  //   isValidNextBlock(nextBlock, previousBlock) {
  //     const nextBlockHash = this.calculateHashForBlock(nextBlock);

  //     if (previousBlock.index + 1 !== nextBlock.index) {
  //       return false;
  //     } else if (previousBlock.hash !== nextBlock.previousHash) {
  //       return false;
  //     } else if (nextBlockHash !== nextBlock.hash) {
  //       return false;
  //     } else if (!this.isValidHashDifficulty(nextBlockHash)) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }

  //   isValidChain(chain) {
  //     if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) {
  //       return false;
  //     }

  //     const tempChain = [chain[0]];
  //     for (let i = 1; i < chain.length; i = i + 1) {
  //       if (this.isValidNextBlock(chain[i], tempChain[i - 1])) {
  //         tempChain.push(chain[i]);
  //       } else {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
}

module.exports = Blockchain;
