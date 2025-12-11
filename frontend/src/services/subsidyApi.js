// frontend/src/services/subsidyApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api"; // adjust if you use different base

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const fetchCategories = async () => {
  const res = await api.get("/subsidy/categories");
  return res.data?.data || [];
};

export const fetchSubsidies = async (params = {}) => {
  // params: { search, category }
  const res = await api.get("/subsidy/list", { params });
  return res.data?.data || [];
};

export default {
  fetchCategories,
  fetchSubsidies,
};
