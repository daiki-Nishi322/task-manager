export type Task = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  tasks: Task[];
};
