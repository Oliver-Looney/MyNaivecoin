class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: Date;
    public data: string;

    constructor(index: number, hash: string, previousHash: string, timestamp: Date, data: string) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}


const calculateHash = (index: number, previousHash: string, timestamp: Date, data: string): string =>
    js - sha256(index + previousHash + timestamp.toString() + data).toString();

const genesisBlock: Block = new Block(0,
    "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7",
    null,
    Date("August 23, 2021 19:13:00"),
    "My Genesis Block");

const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: Date = new Date();
    const nextHash: string = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
    return newBlock;
}

const blockchain: Block[] = [genesisBlock];

const calculateHashForBlock = (inputtedBlock: Block): string => {
    return calculateHash(inputtedBlock.index, inputtedBlock.previousHash, inputtedBlock.timestamp);
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
    return typeof block.index==='number'
    && typeof block.hash==='string'
    && typeof block.timestamp==='Date'
    && typeof block.data==='string';
}


const isValidChain = (blockchainToValidate:Block[]):boolean=>{
    const isValidGenesis = (block:Block):boolean=>{
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if(!isValidGenesis(blockchain[0])){
        return false;
    }

    for(let i=0;i<blockchainToValidate.length;i++){
        if(!isNewBlockValid(blockchainToValidate[i],blockchainToValidate[i-1])){
            return false;
        }
    }
    return true;
}
