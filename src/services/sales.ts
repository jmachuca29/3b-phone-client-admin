import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getSales = () => {
  return axios.get(`${baseUrl}/api/sale`);
};

export {
    getSales
}