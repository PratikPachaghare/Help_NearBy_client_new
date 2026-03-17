import api from "./api";

export async function apiCall(method, endpoint, data = {}, params = {}) {
  try {
    const response = await api({ method, url: endpoint, data, params });
    return response.data;
  } catch (error) {
    console.error("API Error:", endpoint, error?.response?.data || error.message);
    throw error;
  }
}

export default apiCall;

export async function apiCallAuth(method, endpoint, data = {}, params = {}) {
  return apiCall(method, endpoint, data, params);
}

export async function verifyToken(endpoint) {
  return apiCall("GET", endpoint);
}

export async function apiCallImage(endpoint, formData) {
  try {
    const response = await api.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("Upload API Error:", endpoint, error?.response?.data || error.message);
    throw error;
  }
}
