import { useEffect, useState } from "react";
import type { Project, Task } from "./types/project";
import { getProjects } from "./api/projects";
import { createTask, getTasks } from "./api/tasks";
import "./App.css";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

    setTitle('');
    setDescription('');
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

      <h2>タスク一覧</h2>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>
            <span>- {task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
