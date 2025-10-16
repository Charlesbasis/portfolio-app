import api from "../lib/api";
import { ApiResponse, Service } from "../types";

export const servicesService = {
  async getAll() {
    try {
    const { data } = await api.get<ApiResponse<Service[]>>('/services');
    // return data;
    return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return [];
    }
  },
};
