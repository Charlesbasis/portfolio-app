import api from "../lib/api";
import { ApiResponse, Service } from "../types";

export const servicesService = {
  async getAll() {
    const { data } = await api.get<ApiResponse<Service[]>>('/services');
    return data;
  },
};