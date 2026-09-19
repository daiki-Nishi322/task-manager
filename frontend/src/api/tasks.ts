import api from "./axios";
import type { Task } from "../types/project";

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>("/tasks");

  return response.data;
};

export type CreateTaskData = {
  project_id: number;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
};

export const createTask = async (task: CreateTaskData): Promise<Task> => {
  const response = await api.post<Task>("/tasks", task);
  return response.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks${taskId}`);
};

export const updateTask = async (
  taskId: number,
  task: CreateTaskData,
): Promise<Task> => {
  const response = await api.put<Task>(`/tasks${taskId}`, task);

  return response.data;
};
