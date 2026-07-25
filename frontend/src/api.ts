import axios from 'axios';

export interface Community {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  president_name: string;
  president_email: string;
  annual_budget: number | null;
  monthly_dues: number | null;
  founded_year: number | null;
  community_notes: string;
}

// Create and update both send every field except id, so one alias covers both.
export type CommunityInput = Omit<Community, 'id'>;

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const communitiesAPI = {
  list:   (limit = 100) => api.get<Community[]>('/communities', { params: { limit } }),
  get:    (id: number) => api.get<Community>(`/communities/${id}`),
  create: (data: CommunityInput) => api.post<Community>('/communities', data),
  update: (id: number, data: CommunityInput) => api.put<Community>(`/communities/${id}`, data),
  delete: (id: number) => api.delete<void>(`/communities/${id}`),
};

export default api;