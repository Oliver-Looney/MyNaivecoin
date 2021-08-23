import {generateNextBlock, getBlockchain} from './blockchain';
import {Block} from "./Block";
import {connectToPeers, getSockets, initP2PServer} from './peer2peer';
import * as  bodyParser from 'body-parser';
import * as express from 'express';

const httpPort: number =  3011;
const p2pPort: number =  6001;

const sockets: WebSocket[] = [];

export const initHttpServer = (myHttpPort: number) => {
    const app = express();
    app.use(bodyParser.join());

    app.get("/blocks", (req, res) => {
        res.send(getBlockchain());
    });
    app.post("/mineBlock", (req, res) => {
        const newBlock: Block = generateNextBlock(req.body.data);
        res.send(newBlock);
    });
    app.get("/peers", (req, res) => {
        res.send(getSockets().map((s: any) => s._socket.remoteAddress + ":" + s._socket.remotePort));
    });
    app.post("/addPeer", (req, res) => {
        connectToPeers(req.body.peer);
        res.send;
    })
}



initHttpServer(httpPort);
initP2PServer(p2pPort);
