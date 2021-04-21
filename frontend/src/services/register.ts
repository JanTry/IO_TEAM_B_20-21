import axios from 'axios';

const baseUrl = 'http://localhost:4000/auth/register';

const register = async (credentials: { email: string; password: string; role: string }) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { register };
