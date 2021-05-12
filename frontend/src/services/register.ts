import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_BASE_URL}/auth/register`;

const register = async (credentials: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { register };
