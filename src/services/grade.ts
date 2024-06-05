import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getGrade = () => {
  return axios.get(`${baseUrl}/api/grade`);
};

export {
    getGrade
}