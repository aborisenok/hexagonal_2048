import axios from "axios";

import { SERVER_URLS } from "../common/constants";

const getRequestUrl = (serverUrl, port, radius) => {
  const isLocal = serverUrl === SERVER_URLS.LOCAL.value;
  if (isLocal) {
    return `http://${serverUrl}:${port}}/${radius}`;
  } else {
    return `https://${serverUrl}/${radius}`;
  }
}

export const getCellsData = (requstData, filledCells) => {
  const url = getRequestUrl(requstData.serverUrl, requstData.port, requstData.radius);
  return axios
    .post(url, filledCells)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
    })
    .catch((err) => {
      throw new Error('Server responce error');
    });
};
