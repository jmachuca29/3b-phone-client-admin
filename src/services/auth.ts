import axios, { AxiosResponse } from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const signIn = (body: any): Promise<AxiosResponse<any, any>> => {
    return axios.post(`${baseUrl}/api/auth/admin`, body);
  };

  export {
    signIn
}