import { GenericRecord } from '@/types';
import API from './api';

export const loginUser = async (email:string, password:string) => {
  try {
    const { data } = await API.post('/oauth/token', {
      grant_type: 'password',
      client_id: process.env.NEXT_PUBLIC_API_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_API_CLIENT_SECRET,
      username: email,
      password: password,
      scope: '',
    });
    return data;
  }
  catch (error) {
    throw error;
  }
};



export const forgotPassword = (params: GenericRecord) => API.post('/api/forgot-password', { params });
export const resetPassword = (params: GenericRecord) => API.post('/api/reset-password', { params });

export const getUser = () => API.get("/api/auth/user");
