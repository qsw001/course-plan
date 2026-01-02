import axios from 'axios';
import type { Course, ScheduleResponse } from './types';

const API_BASE_URL = 'http://localhost:8080';

export const api = {
  getAllCourses: async () => {
    const response = await axios.get<Course[]>(`${API_BASE_URL}/courses`);
    return response.data;
  },
  
  getCourseById: async (id: string) => {
    const response = await axios.get<Course>(`${API_BASE_URL}/courses/id/${id}`);
    return response.data;
  },

  addCourse: async (course: Course) => {
    const response = await axios.post(`${API_BASE_URL}/courses`, course);
    return response.data;
  },

  updateCourse: async (course: Course) => {
    const response = await axios.put(`${API_BASE_URL}/courses`, course);
    return response.data;
  },

  deleteCourse: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/courses/id/${id}`);
    return response.data;
  },

  getSchedule: async (semester: number) => {
    const response = await axios.get<ScheduleResponse>(`${API_BASE_URL}/schedule/${semester}`);
    return response.data;
  }
};
