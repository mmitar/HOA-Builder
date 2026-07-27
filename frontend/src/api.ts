import axios from 'axios';

export interface Note {
  note_id: number;
  message: string;
  creation_date: string;
}

export interface Community {
  community_id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  president_name: string;
  president_email: string;
  annual_budget: number | null;
  monthly_dues: number | null;
  founded_year: number | null;
}

// Create and update both send every field except community_id, so one alias covers both.
export type CommunityInput = Omit<Community, 'community_id'>;
export type NoteInput = Omit<Note, 'note_id' | 'creation_date'>;

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const communitiesAPI = {
  list:   (limit = 100) => api.get<Community[]>('/communities', { params: { limit } }),
  get:    (community_id: number) => api.get<Community>(`/communities/${community_id}`),
  create: (data: CommunityInput) => api.post<Community>('/communities', data),
  update: (community_id: number, data: CommunityInput) => api.put<Community>(`/communities/${community_id}`, data),
  delete: (community_id: number) => api.delete<void>(`/communities/${community_id}`),
};

export const notesAPI = {
  list:   (communityId: number) => api.get<Note[]>(`/communities/${communityId}/notes/`),
  get:    (communityId: number, noteId: number) => api.get<Note>(`/communities/${communityId}/notes/${noteId}`),
  create: (communityId: number, data: NoteInput) => api.post<Note>(`/communities/${communityId}/notes`, data),
  update: (communityId: number, noteId: number, data: NoteInput) => api.put<Note>(`/communities/${communityId}/notes/${noteId}`, data),
  delete: (communityId: number, noteId: number) => api.delete<void>(`/communities/${communityId}/notes/${noteId}`),
};

export default api;