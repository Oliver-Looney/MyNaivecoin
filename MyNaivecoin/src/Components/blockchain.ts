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
    Date("2021-08-23"),
    "My Genesis Block");

const generateNextBlock = (blockData:string)=>{
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index+1;
    const nextTimestamp: Date = new Date();
    const nextHash:string = calculateHash(nextIndex,previousBlock.hash,nextTimestamp,blockData);
    const newBlock:Block = new Block(nextIndex,nextHash,previousBlock.hash,nextTimestamp,blockData);
    return newBlock;
}

const blockchain: Block[] = [genesisBlock];


