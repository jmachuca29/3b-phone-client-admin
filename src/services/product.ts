import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getProducts = () => {
  return axios.get(`${baseUrl}/api/product`);
};

export {
    getProducts
}