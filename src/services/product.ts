import axios, { AxiosResponse } from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getProducts = () => {
  return axios.get(`${baseUrl}/api/product`);
};

const getProductbyID = (id: string) => {
  return axios.get(`${baseUrl}/api/product/${id}`);
};

const createProduct = (body: any): Promise<AxiosResponse<any, any>> => {
  return axios.post(`${baseUrl}/api/product`, body);
};

const updateProduct = (id: string, body: any): Promise<AxiosResponse<any, any>> => {
  return axios.put(`${baseUrl}/api/product/${id}`, body);
};

export {
    getProducts,
    getProductbyID,
    createProduct,
    updateProduct
}