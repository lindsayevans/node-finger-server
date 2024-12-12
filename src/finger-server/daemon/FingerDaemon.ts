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

/** Creates a new finger daemon */
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

  /** Handle requests */
  on<T extends RequestTypeName>(
    type: T,
    handler: (request: RequestType<T>) => Promise<void | string> = async (
      request: RequestType<T>
    ) => {}
  ) {
    this.requestHandlers[type] = handler;
  }

  /** Starts the finger daemon listening on the specified host & port */
  listen(host?: string, port: number = 79, cb = () => {}) {
    net
      .createServer((socket) => {
        socket.setEncoding('utf8');
        this.config.logger?.log(socket.remoteAddress, 'Connection established');

        socket.on('data', async (data) => {
          try {
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
          } catch (e) {
            this.config.logger?.error(
              socket.remoteAddress,
              'Error handling request:',
              e
            );
          } finally {
            socket.end();
          }
        });

        socket.on('end', () => {
          this.config.logger?.log(socket.remoteAddress, 'Connection closed');
          socket.end();
        });
      })
      .listen(port, host);

    cb();
  }
}
