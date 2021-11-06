import axios from 'axios'

const axiosCreate = axios.create({ baseURL: 'http://localhost:9999/' })

export const getApi = async ({ url }) => {
  let result = await axiosCreate.get(url)
  return result
}

export const postApi = async ({ url, data }) => {
  try {
    return await axiosCreate.post(url, data)
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteApi = async ({ url, data }) => {
  try {
    return await axiosCreate.post(url, data)
  } catch (error) {
    throw new Error(error)
  }
}