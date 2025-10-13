import api from "../lib/api";
import { ApiResponse, Testimonial } from "../types";

export const testimonialsService = {
  async getAll() {
    const { data } = await api.get<ApiResponse<Testimonial[]>>('/testimonials');
    return data;
  },
};