import axios from 'axios'

const axiosCreate = axios.create({ baseURL: 'http://localhost:9999' })

export const iniciarConexaoWhatsapp = async () => {
  let result = await axiosCreate.get('/')
  return result
}