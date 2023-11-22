import axios from "axios";

export const api = axios.create({
  baseURL: "https://marketlist-nodejs-api.onrender.com/",
});
