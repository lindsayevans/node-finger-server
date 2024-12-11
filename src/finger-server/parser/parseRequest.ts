import { ListRequest } from '../daemon/ListRequest';
import { UserRequest } from '../daemon/UserRequest';

export const REQUEST_MATCH =
  /^(\/W)?\s*([\+\-\_\.\/\=\?a-z0-9]*)(?:@([@\.:\-0-9a-z]+))*\r\n$/i;

export const parseRequest = (rawRequest: string): ListRequest | UserRequest => {
  const request: ListRequest = { verbose: false };

  return request;
};
