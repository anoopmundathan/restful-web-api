const SHA256 = require('crypto-js/sha256');
const level = require('level');

const chainDB = './blockchain';
const db = level(chainDB);

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/
class Blockchain {

  constructor() {
    this.getBlockHeight()
      .then((height) => {
        if (height === -1) {
          this.addBlock(new Block("First block - Genesis block"));
        }
      })
  }

  getBlockHeight() {
    return new Promise((resolve, reject) => {
      let height = -1;
      db.createReadStream()
        .on('data', (data) => {
          height++;
        })
        .on('error', () => {
          reject(error);
        })
        .on('close', () => {
          resolve(height);
        });
    });
  }

  async addBlock(newBlock) {

    const height = parseInt(await this.getBlockHeight());

    newBlock.height = height + 1;
    newBlock.time = new Date().getTime().toString().slice(0, -3);

    if (newBlock.height > 0) {
      const prevBlock = await this.getBlock(height)
      newBlock.previousBlockHash = prevBlock.hash
      console.log(`Previous block hash: ${newBlock.previousBlockHash}`)
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    console.log(`New hash: ${newBlock.hash}`)
    await this.addBlockToDB(newBlock.height, JSON.stringify(newBlock));
    
  }

  addBlockToDB(key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (error) => {
        if (error) {
          reject(error)
        }
        console.log(`Block is added #${key}`)
        resolve(`Block is added #${key}`)
      })
    })
  }


  async getBlock(blockHeight) {
    return JSON.parse(await this.getBlockFromDB(blockHeight));
  }

  getBlockFromDB(key) {
    return new Promise((resolve, reject) => {
      db.get(key, (error, value) => {
        if (error) {
          reject(error)
        }
        resolve(value)
      })
    })
  }

  async validateBlock(blockHeight) {
    const block = await this.getBlock(blockHeight);
    const blockHash = block.hash;
    block.hash = '';
    return (blockHash === SHA256(JSON.stringify(block)).toString()) ? true : false;
  }

  async validateChain() {
    const errorLog = [];
    let previousHash = ''
    let valid = false
    let block;
    const height = await this.getBlockHeight();

    for (let i = 0; i <= height; i++) {
      block = await this.getBlock(i)
      valid = await this.validateBlock(block.height)

      if (!valid) {
        errorLog.push(i)
      }

      if (block.previousBlockHash !== previousHash) {
        errorLog.push(i)
      }

      previousHash = block.hash

      if (i === height) {
        if (errorLog.length > 0) {
          console.log(`Number of block errors = ${errorLog.length}`)
          console.log(`Blocks: ${errorLog}`)
        } else {
          console.log('No error')
        }
      }

    }
  }
}

module.exports = Blockchain
