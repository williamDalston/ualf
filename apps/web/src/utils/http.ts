import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  config.headers["x-request-id"] = crypto.randomUUID();
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const rid = data?.error?.request_id;
    const code = data?.error?.code;
    const msg = data?.error?.message || "Request failed";
    return Promise.reject({ status, code, msg, request_id: rid });
  }
);
