import axios from 'axios';
import type { Project } from '../types/project';

export const getProjects = async (): Promise<Project[]> => {
  const response = await axios.get<Project[]>(
    'http://localhost:8000/api/projects'
  );

  return response.data;
};
