import {sha256} from "js-sha256";
import {Block} from "./Block";
import {broadcastLatest} from './main';


const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string =>
    sha256(index + previousHash + timestamp.toString() + data).toString();

const genesisBlock: Block = new Block(0,
    "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7",
    null,
    1629747054,
    "My Genesis Block");

const getLatestBlock = () => {
    return blockchain[blockchain.length - 1];
}
 const getBlockchain = () => {
    return blockchain;
}

 const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = new Date().getTime() / 1000;
    const nextHash: string = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
    addBlock(newBlock);
    broadcastLatest();
    return newBlock;
}

const addBlock = (newBlock:Block)=>{
    if(isNewBlockValid(newBlock,getLatestBlock())){
        blockchain.push(newBlock);
    }
}

let blockchain: Block[] = [genesisBlock];

const calculateHashForBlock = (inputtedBlock: Block): string => {
    return calculateHash(inputtedBlock.index, inputtedBlock.previousHash, inputtedBlock.timestamp, inputtedBlock.data);
}

/**
 * Returns Boolean of validity of block
 *
 * @param newBlock - The new block being validated
 * @param previousBlock - The latest block in the chain, being used to validate newBlock
 * @return boolean
 */
const isNewBlockValid = (newBlock: Block, previousBlock: Block) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log("Invalid Index");
        return false;
    }
    if (previousBlock.hash !== newBlock.previousHash) {
        console.log("Invalid Previous Hash");
        return false;
    }
    if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + " " + typeof calculateHashForBlock(newBlock));
        console.log("Invalid hash: " + calculateHashForBlock(newBlock) + " " + newBlock.hash);
        return false;
    }
    return isValidBlockStructure(newBlock);
}

/**
 * Returns Boolean of validity of block structure
 * @param block - Block getting it's structure verified
 * @return boolean
 */
const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
}


const isValidChain = (blockchainToValidate: Block[]): boolean => {
    const isValidGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isValidGenesis(blockchain[0])) {
        return false;
    }
    for (let i = 0; i < blockchainToValidate.length; i++) {
        if (!isNewBlockValid(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
}

const replaceChain = (newBlocks: Block[]) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log("Received blockchain is valid, replacing current blockchain with recieved blockchain");
        blockchain = newBlocks;
        broadcastLatest();
    } else {
        console.log("Recieved blockchain is invalid");
    }
}

const addBlockToChain = (newBlock:Block):boolean=>{
    if(isNewBlockValid(newBlock,getLatestBlock())){
        blockchain.push(newBlock);
        return true;
    }
    return false;
}

export {Block, getBlockchain, getLatestBlock, generateNextBlock, isValidBlockStructure, replaceChain, addBlockToChain};
