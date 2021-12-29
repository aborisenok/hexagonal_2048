import axios from 'axios';
import * as api from '../logic/api';

const remoteRequestParams = {
  serverUrl: 'serverUrl',
  port: 80,
  radius: 3
};

const localRequestParams = {
  serverUrl: 'localhost',
  port: 80,
  radius: 3
}

describe('api success request', () => {
  let mock;

  beforeEach(() => {
    mock = jest.spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve({
        status: 200,
        data: 'data'
      }));
  });
  afterEach(() => {
    mock.mockRestore();
  });

  it('check remote host request url', async () => {
    await api.getCellsData(remoteRequestParams, []);

    expect(mock).toHaveBeenCalledWith('http://serverUrl/3', []);
  });

  it('check local host request url', async () => {
    await api.getCellsData(localRequestParams, []);

    expect(mock).toHaveBeenCalledWith('http://localhost:80/3', []);
  });

  it('check success responce', async () => {
    const data = await api.getCellsData(remoteRequestParams, []);

    expect(data).toBe('data');
  });
});


describe('api erroe request', () => {
  let mock;

  beforeEach(() => {
    mock = jest.spyOn(axios, 'post');
  });
  afterEach(() => {
    mock.mockRestore();
  });

  it('check error responce', async () => {
    expect(api.getCellsData(remoteRequestParams, [])).rejects.toThrow('Server responce error');
  });
});
