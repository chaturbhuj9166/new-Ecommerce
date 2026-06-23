import axios from "axios";

const baseURL =
  import.meta.env.VITE_BASEURL || "http://localhost:5000";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export { baseURL };
export default instance;