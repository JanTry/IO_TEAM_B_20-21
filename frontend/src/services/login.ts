import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_BASE_URL}/auth/login`;

const login = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
