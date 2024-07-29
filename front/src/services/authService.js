import axiosInstance from './api';

const API_URL = '/api/auth'; 

const loginWithGoogle = async (tokenId) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/google`, {
      token: tokenId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  loginWithGoogle,
};
