
import { Server, Socket } from "net";
import ISClient from "./ISClient";
import ISDiscord from "../discord/ISDiscord";
import ConsoleInput from '../console/ConsoleInput'


export default class ISServer {
    public serverKey: string = "SERVER0";
    private server: Server;
    public serverList: Array<ISClient> = new Array<ISClient>();
    public Discord: ISDiscord = new ISDiscord(this);
    public CInput: ConsoleInput = new ConsoleInput(this);

    private _isEnabled: boolean = false;

    constructor() {
        this.server = new Server();
        this.server.on("connection", (socket: Socket) => {
            this.serverList.push(new ISClient(this, socket));
        });
        //this.server.on("error", (err: Error)=>{
            //this.CInput._send(`${err.name} > ${err.message} \non:${err.stack}`);
        //});
    }

    public listen(port: number): void {
        this.server.listen(port);
        console.log(`[Server] Started listening at ${port}`);
        this._isEnabled = true;
    }

    public getSocket(): Server {
        return this.server;
    }

    public isEnabled(): boolean {
        return this._isEnabled;
    }
}
