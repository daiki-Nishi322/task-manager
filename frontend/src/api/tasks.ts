import axios from 'axios';
import type { Task } from '../types/project';

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(
    'http://localhost:8000/api/tasks'
  );

  return response.data;
};

export type CreateTaskData = {
  project_id: number;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
};

export const createTask = async (
  task: CreateTaskData
): Promise<Task> => {
  const response = await axios.post<Task>(
    'http://localhost:8000/api/tasks',
    task
  );
  return response.data;
};
