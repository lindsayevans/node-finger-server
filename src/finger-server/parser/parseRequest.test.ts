import { describe, expect, test } from '@jest/globals';

import { parseRequest } from './parseRequest';

const CRLF = '\r\n';

describe('Request parser', () => {
  test('handles basic list requests', () => {
    const req = parseRequest(CRLF);
    expect('username' in req).toBeFalsy();
  });

  test('handles verbose list requests', () => {
    const req = parseRequest('/W' + CRLF);
    expect('username' in req).toBeFalsy();
    expect(req.verbose).toBeTruthy();
  });

  test('handles basic user requests', () => {
    const req = parseRequest('foo' + CRLF);
    expect('username' in req).toBeTruthy();
    expect(req.verbose).toBeFalsy();
  });

  test('handles verbose user requests', () => {
    const req = parseRequest('/W foo' + CRLF);
    expect('username' in req).toBeTruthy();
    expect(req.verbose).toBeTruthy();
  });

  test('handles recursive requests', () => {
    const req = parseRequest('@foo@bar' + CRLF);
    expect(req.hosts).toBeDefined();
    expect(req.hosts?.length).toBe(2);
  });
});
