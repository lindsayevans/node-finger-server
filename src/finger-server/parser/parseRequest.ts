import { ListRequest } from '../daemon/ListRequest';
import { UserRequest } from '../daemon/UserRequest';

export const REQUEST_MATCH =
  /^(?<verbose>\/W)?\s*(?<user>[\+\-\_\.\/\=\?a-z0-9]*)(?<hosts>:@([@\.:\-0-9a-z]+))*\r\n$/i;

export const parseRequest = (rawRequest: string): ListRequest | UserRequest => {
  const request: ListRequest | UserRequest = { verbose: false };
  const match = REQUEST_MATCH.exec(rawRequest);

  if (match && match.groups) {
    const { verbose, user, hosts } = match.groups;
    request.verbose = verbose === '/W';

    if (user) {
      (request as UserRequest).username = user;
    }

    if (hosts) {
      request.hosts = hosts.split('@');
    }
  }

  return request;
};
