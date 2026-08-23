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

export const deleteTask = async (taskId: number): Promise<void> => {
  await axios.delete(`http://localhost:8000/api/tasks/${taskId}`);
};

export const updateTask = async (
  taskId: number,
  task: CreateTaskData
): Promise<Task> => {
  const response = await axios.put<Task>(
    `http://localhost:8000/api/tasks/${taskId}`,
    task
  );

  return response.data;
};
