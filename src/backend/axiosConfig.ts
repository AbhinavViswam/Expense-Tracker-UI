import axios from "axios";

export const axiosClient = axios.create({
  baseURL: `/api`,
  timeout: 8000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});
