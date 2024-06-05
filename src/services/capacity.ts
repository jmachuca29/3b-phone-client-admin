import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getCapacity = () => {
  return axios.get(`${baseUrl}/api/capacity`);
};

export {
    getCapacity
}