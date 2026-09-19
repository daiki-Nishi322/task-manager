import React, { useEffect, useState } from "react";
import type { Project, Task } from "./types/project";
import { getProjects } from "./api/projects";
import { createTask, deleteTask, getTasks, updateTask } from "./api/tasks";
import { login } from "./api/auth";
import "./App.css";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    if (!title.trim()) {
      setError("タイトルを入力してください。");
      return;
    }

    if (!description.trim()) {
      setError("説明を入力してください。");
      return;
    }
    setError(null);

    try {
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
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              errors?: {
                title?: string[];
                description?: string[];
              };
            };
          };
        };

        setError(
          axiosError.response?.data?.errors?.title?.[0] ??
            "Taskの作成に失敗しました。",
        );
      } else {
        setError("Taskの作成に失敗しました。");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoginError(null);

    try {
      const response = await login({
        email,
        password,
      });

      console.log("ログイン成功:", response);

      localStorage.setItem("token", response.token);

      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setLoginError("メールアドレスまたはパスワードが正しくありません。");
    }
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

  const handleStatusChange = async (taskId: number, status: string) => {
    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return;
    }

    const updatedTask = await updateTask(taskId, {
      project_id: task.project_id,
      title: task.title,
      description: task.description,
      status,
      due_date: task.due_date,
    });

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  };

  return (
    <div>
      <h1>Task Manager</h1>

      <h2>ログイン</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">ログイン</button>
      </form>

      {loginError && <p>{loginError}</p>}

      {isLoggedIn && <p>ログインしました。</p>}

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

      {error && <p>{error}</p>}

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
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="not_started">未着手</option>
              <option value="in_progress">進行中</option>
              <option value="completed">完了</option>
            </select>
            <button onClick={() => handleEdit(task)}>編集</button>
            <button onClick={() => handleDelete(task.id)}>削除</button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
