import axios from 'axios'

const axiosCreate = axios.create({ baseURL: 'http://localhost:9999/' })

export const getApi = async ({url}) => {
  let result = await axiosCreate.get(url)
  return result
}