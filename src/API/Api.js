import axios from 'axios';

// Base URL for the API
export const BASE_URL = "http://localhost:8000/api";

// Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
 

export const getToken = () => localStorage.getItem("token");

// Utility: Get user object from localStorage
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Utility: Logout function
export const logoutAPI = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/"; // Redirect to login page or home
};

// Generalized API request handler
export const apiRequest = async (endpoint, data = {}, method = "get") => {
  const token = getToken();
  const isFormData = data instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  try {
    const config = {
      url: endpoint,
      method,
      headers,
      ...(method === "get" ? { params: data } : { data }),
    };

    const response = await axiosInstance.request(config);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    // Rethrow parsed error for component-level handling
    throw error.response?.data || { message: error.message };
  }
};

// Auth APIs
export const loginAPI = async (payload) => {
  const data = await apiRequest("/user/login", payload, "post");
  if (data?.token) {
    localStorage.setItem("token", data.token);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }
  return data;
};

export const registerAPI = async (payload) => {
  return await apiRequest("/user/register", payload, "post");
};

// User Info
export const getUserInfo = async () => {
  return await apiRequest("/user/getUserInfo", {}, "get");
};
 
export const createCategory = async (payload)=>{
  return await apiRequest("/category/create",payload,"post")
}

export const deleteCategory = async (ID) => {
  return await apiRequest(`/category/deleteCategory/${ID}`, {}, "delete");
};

export const updateCategory = async (ID, payload) => {
  return await apiRequest(`/category/updateCategory/${ID}`, payload, "put");
};

export const getAllCategories = async () => {
  return await apiRequest("/category/getAllCategories", {}, "get");
};

// products api
export const createproduct =async(formData) => {
  return await apiRequest("/product/create",formData,"post")
};

export const deleteproduct = async (ID) => {
  return await apiRequest(`/product/deleteProduct/${ID}`, {}, "delete");
};

export const getAllproducts = async () => {
  return await apiRequest("/product/getAllProducts", {}, "get");
};

export const getproductByID = async (id) =>{
   return await apiRequest(`/product/getProductById/${id}`, {}, 'get');
};

export const updateproduct = async (id, formData) => {
  return await apiRequest(`/product/updateProduct/${id}`, formData, 'put' );
};


export default axiosInstance;
