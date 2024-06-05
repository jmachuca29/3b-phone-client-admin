import axios, { AxiosResponse } from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getSales = () => {
  return axios.get(`${baseUrl}/api/sale`);
};

const getSalebyUID = (uuid: string) => {
  return axios.get(`${baseUrl}/api/sale/uid/${uuid}`);
};

const updateSaleStatus = (id: string, body: any): Promise<AxiosResponse<any, any>> => {
  const data = { status: body }
  return axios.patch(`${baseUrl}/api/sale/${id}`, data);
};


export {
    getSales,
    getSalebyUID,
    updateSaleStatus
}