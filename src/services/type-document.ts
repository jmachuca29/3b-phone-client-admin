import axios, { AxiosResponse } from "axios"

const baseUrl = import.meta.env.VITE_API_URL

const getDocumentType = (): Promise<AxiosResponse<any[], any>> => {
    return axios.get(`${baseUrl}/api/document-type`)
}

export default getDocumentType