import { useEffect, useState } from "react";
import type { Project, Task } from "./types/project";
import { getProjects } from "./api/projects";
import { createTask, deleteTask, getTasks, updateTask } from "./api/tasks";
import "./App.css";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
    });

    getTasks().then((data) => {
      setTasks(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask = await createTask({
      project_id: 1,
      title,
      description,
      status: "not_started",
      due_date: null,
    });

    setTasks((currentTasks) => [...currentTasks, newTask]);

    setTitle("");
    setDescription("");
  };

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingTaskId === null) {
      return;
    }

    const updatedTask = await updateTask(editingTaskId, {
      project_id: 1,
      title: editTitle,
      description: editDescription,
      status: "not_started",
      due_date: null,
    });

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );

    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  return (
    <div>
      <h1>Task Manager</h1>

      <h2>プロジェクト一覧</h2>

      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>

          <h4>タスク一覧</h4>

          <ul>
            {project.tasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Task作成</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Taskを作成</button>
      </form>

      {editingTaskId !== null && (
        <div>
          <h2>Task編集</h2>

          <form onSubmit={handleUpdate}>
            <div>
              <label>タイトル</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>

            <div>
              <label>説明</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            <button type="submit">Taskを更新</button>
          </form>
        </div>
      )}

      <h2>タスク一覧</h2>

      <ul>
        {tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>- {task.status}</p>
            <button onClick={() => handleEdit(task)}>編集</button>
            <button onClick={() => handleDelete(task.id)}>削除</button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
