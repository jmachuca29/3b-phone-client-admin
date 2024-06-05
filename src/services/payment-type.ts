import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getPaymentType = () => {
  return axios.get(`${baseUrl}/api/payment-type`);
};

export {
    getPaymentType
}