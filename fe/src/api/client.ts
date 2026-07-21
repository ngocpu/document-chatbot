import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

/** Shared Axios instance for all backend calls (upload, chat, sessions). */
export const apiClient = axios.create({ baseURL });
