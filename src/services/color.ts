import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getColor = () => {
  return axios.get(`${baseUrl}/api/color`);
};

export {
    getColor
}
