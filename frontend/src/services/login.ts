import axios from 'axios'
const baseUrl = 'http://localhost:4000/auth/login'

const login = async (credentials: {email: string, password: string}) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }