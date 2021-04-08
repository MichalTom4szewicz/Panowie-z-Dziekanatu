import { Server } from "https";

export class AuthServer {
  private _server: Server;
  private _port: number;

  set port(value: number) {
    this._port = value;
  }

  public set server(newServer: Server) {
    this._server = newServer;
  }

  public start(): void {
    this._server.listen(this._port, () => {
      console.log('Listening on port', this._port);
    })
  }
}
