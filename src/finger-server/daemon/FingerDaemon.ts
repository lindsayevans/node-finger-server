import net from 'node:net';

import { Configuration } from '../configuration/Configuration';
import { DefaultConfiguration } from '../configuration/DefaultConfiguration';
import { parseRequest } from '../parser/parseRequest';
import { ListRequest } from './ListRequest';
import { UserRequest } from './UserRequest';

type RequestTypeName = 'list' | 'user';
type RequestType<T> = T extends 'list'
  ? ListRequest
  : T extends 'user'
  ? UserRequest
  : never;

export class FingerDaemon {
  private config!: Configuration;

  private requestHandlers: {
    [T in RequestTypeName]: (request: any) => Promise<void | string>;
  } = {
    list: async () => {},
    user: async () => {},
  };

  constructor(config?: Configuration) {
    this.config = Object.assign({}, DefaultConfiguration, config);
  }

  on<T extends RequestTypeName>(
    type: T,
    handler: (request: RequestType<T>) => Promise<void | string> = async (
      request: RequestType<T>
    ) => {}
  ) {
    this.requestHandlers[type] = handler;
  }

  listen(host: string, port: number, cb = () => {}) {
    net
      .createServer((socket) => {
        socket.setEncoding('utf8');
        this.config.logger?.log(socket.remoteAddress, 'Connection established');

        socket.on('data', async (data) => {
          this.config.logger?.log(socket.remoteAddress, 'Request: ' + data);

          const request = parseRequest(data.toString());

          let response = '';

          const handlerResponse = await this.requestHandlers[
            'username' in request ? 'user' : 'list'
          ](request);
          if (handlerResponse) {
            response = handlerResponse;
          }

          socket.write(response);
          socket.end();
        });
        socket.on('end', () => {
          this.config.logger?.log(socket.remoteAddress, 'Connection closed');
          socket.end();
        });
      })
      .listen(port, host);

    cb();
  }

  async shutdown() {
    this.config.logger?.log('Shutting down...');
    // TODO: close all connections in pool
    // socket.destroy();
  }
}
