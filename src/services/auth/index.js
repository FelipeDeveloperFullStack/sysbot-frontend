import axios from 'axios'

const axiosCreate = axios.create({ baseURL: process.env.REACT_APP_URL })

export const iniciarConexaoWhatsapp = async () => {
  let result = await axiosCreate.get('/')
  return result
}
