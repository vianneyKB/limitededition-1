import axios from "axios";
import qs from "qs";

export const REACT_APP_BASE_URL = `https://nhan.tech:4000`

const api = axios.create({
  baseURL: `${REACT_APP_BASE_URL}/api`,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  function (config) {
    // let accessToken = getToken();
    // let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzQWN0aXZlIjp0cnVlLCJfaWQiOiI2MTQ0OWZhNjExNDdiNDA5OGI4YWM0NWMiLCJ1c2VySWQiOiIxMSIsImNvbXBhbnkiOiI2MTQwNTQwODFjOGRhZTI4NzFjZGRiZTAiLCJuYW1lIjoixJBvw6BuIiwic3VybmFtZSI6IlRo4bq_IEFuaCIsInVzZXJOYW1lIjoibWVtYmVyMSIsImVtYWlsQWRkcmVzcyI6Im1lbWJlcjFAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIwOTY0MjI1MTYyIiwicHJvZmlsZVBpY3R1cmVJZCI6bnVsbCwiY3JlYXRpb25UaW1lIjoiMjAyMS0wOS0xMlQxODozNjowNy41NjNaIiwiX192IjowfSwiYWNjZXNzdG9rZW4iOiI2MjNjMzkxMTg4YmQ4YThhZDI3ODY2NjUiLCJpYXQiOjE2NDgxMTM5Mzd9.wHAaFzIaBoB8A_WaJp5KHnw5U8jEiQ970anbFfvjiOQ';
    // if (accessToken) {
    //   config.headers.common["Authorization"] = "Bearer " + accessToken;
    // }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      // redirect to login
    } else if (error && error.response && error.response.status === 403) {
      // go to 403 page
      // window.location.href = "/app/403"
    }
    return Promise.reject(error);
  }
);

export const apiGet = (url, { params = {}, otps = {}, qsOtps = {} }) => {
  return api.get(
    url,
    {
      params,
      paramsSerializer: (param) =>
        qs.stringify(param, {
          arrayFormat: "repeat",
          charset: "utf-8",
          ...qsOtps,
        }),
    },
    otps
  );
};

export const apiPost = (
  url,
  { params = {}, data = {}, otps = {}, qsOtps = {} }
) => {
  const paramString = qs.stringify(params, {
    arrayFormat: "repeat",
    charset: "utf-8",
    ...qsOtps,
  });
  const urlPost = paramString ? `${url}?${paramString}` : url;
  return api.post(urlPost, data, otps);
};

export const apiPut = (
  url,
  { params = {}, data = {}, otps = {}, qsOtps = {} }
) => {
  const paramString = qs.stringify(params, {
    arrayFormat: "repeat",
    charset: "utf-8",
    ...qsOtps,
  });
  const urlPut = paramString ? `${url}?${paramString}` : url;
  return api.put(urlPut, data, otps);
};

export const apiPatch = (
  url,
  { params = {}, data = {}, otps = {}, qsOtps = {} }
) => {
  const paramString = qs.stringify(params, {
    arrayFormat: "repeat",
    charset: "utf-8",
    ...qsOtps,
  });
  const urlPut = paramString ? `${url}?${paramString}` : url;
  return api.patch(urlPut, data, otps);
};

export const apiDelete = (url, { params = {}, otps = {}, qsOtps = {} }) => {
  const paramString = qs.stringify(params, {
    arrayFormat: "repeat",
    charset: "utf-8",
    ...qsOtps,
  });
  const urlDelete = paramString ? `${url}?${paramString}` : url;
  return api.delete(urlDelete, otps);
};

export default api;
