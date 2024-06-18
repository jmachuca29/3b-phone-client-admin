import axios from "axios"

const baseUrl = import.meta.env.VITE_API_URL

export const getUbigeo = () => {
    return axios.get(`${baseUrl}/api/ubigeo`)
}