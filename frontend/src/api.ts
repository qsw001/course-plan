import axios from 'axios';
import type { Course, ScheduleResponse } from './types';

const API_BASE_URL = 'http://localhost:8080';

export const api = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const response = await axios.get(`${API_BASE_URL}/courses/id/${id}`);
    return response.data;
  },

  getCourseByName: async (name: string): Promise<Course> => {
    const response = await axios.get(`${API_BASE_URL}/courses/name/${name}`);
    return response.data;
  },

  addCourse: async (course: Course): Promise<void> => {
    await axios.post(`${API_BASE_URL}/courses`, course);
  },

  updateCourse: async (course: Course): Promise<void> => {
    await axios.put(`${API_BASE_URL}/courses`, course);
  },

  deleteCourse: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/id/${id}`);
  },

  getSchedule: async (semester: number): Promise<ScheduleResponse> => {
    const response = await axios.get(`${API_BASE_URL}/schedule/${semester}`);
    return response.data;
  },
};
