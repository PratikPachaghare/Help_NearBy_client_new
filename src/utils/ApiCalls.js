import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { BASE_URL } from './api';

export default apiCall = async (method, endpoint, data = {}, params = {}) => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    console.log('API Error:', endpoint, error?.response?.data || error.message);
    return null;
  }
};

import axios from "axios";

const BASE_URL_AUTH = BASE_URL;


export const apiCallImage = async (
  method,
  endpoint,
  formData,
  params = {}
) => {
  try {
    const token = await AsyncStorage.getItem('token');

    // Build query params
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL_AUTH}${endpoint}${query ? `?${query}` : ''}`;

    console.log(`📸 Image API → ${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type' :'multipart/form-data',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.log('❌ Image API Error:', result);
      return null;
    }

    return result;
  } catch (error) {
    console.log('❌ Image API Error:', error.message);
    return null;
  }
};

export const apiCallAuth = async (method, endpoint, data = {}, params = {}) => {
  try {
    const url = `${BASE_URL_AUTH}${endpoint}`;
    console.log(`📡 Sending ${method} to ${url}`);
    
    let response;

    // Use specific methods to ensure Axios handles the body correctly
    if (method.toUpperCase() === 'POST') {
      response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
        params: params
      });
    } else if (method.toUpperCase() === 'GET') {
      response = await axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
        params: params
      });
    }

    return response.data;
  } catch (error) {
    console.log('❌ Auth API Error:', error.response?.data || error.message);
    return error.response?.data || null;
  }
};

export const verifyToken = async (method, endpoint, token, params = {}) => {
  try {
   
    const response = await axios({
      method,
      url: BASE_URL_AUTH + endpoint,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.log(
      'veryToken API Error:',
      endpoint,
      error?.response?.data || error.message,
    );
    return null;
  }
};


export const apiCallsTest = async (method, endpoint, data = {}, params = {}) => {
  try {
    console.log(`${method} to ${endpoint} with data:`, params, data, 'and params:');
    return { success: true };
  } catch (error) {
    console.log('API Error:', endpoint, error?.response?.data || error.message);
    return null;
  }
};