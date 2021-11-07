import axios from 'axios'

const axiosCreate = axios.create({ baseURL: process.env.REACT_APP_URL })

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