import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api", // server route should be put here
    withCredentials: true,
});