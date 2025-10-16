import api from "../lib/api";
import { ApiResponse, Testimonial } from "../types";

export const testimonialsService = {
  async getAll() {
    try {
    const { data } = await api.get<ApiResponse<Testimonial[]>>('/testimonials');
    // return data;
    return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      return [];
    }
  },
};
