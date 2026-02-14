import axios from "axios";

const API_URL = "http://localhost:5119";

//* Instancia básica
export const axionsInstanceBearer = axios.create({
  baseURL: API_URL,
});
