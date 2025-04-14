import { useEffect, useState } from "react";

export default function TodoList({ isDarkMode }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filteredTasks, setFilteredTasks] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const API_BASE_URL = "https://fast-api-ffw9.onrender.com";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      const mappedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.is_completed ?? false,
      }));
      setTasks(mappedTasks);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  const addTask = async () => {
    if (task.trim() === "") return;

    const newTask = {
      title: task,
      is_completed: false,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([
          ...tasks,
          {
            id: createdTask.id,
            title: createdTask.title,
            completed: createdTask.is_completed,
          },
        ]);
        setTask("");
      } else {
        console.error("Failed to create task");
      }
    } catch (err) {
      console.log("Error creating task:", err);
    }
  };

  const saveEdit = async (id) => {
    const updatedTask = {
      title: newTitle,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, title: updatedTaskData.title } : task
        );
        setTasks(updatedTasks);
        setEditIndex(null);
        setNewTitle("");
      } else {
        console.error("Failed to update task");
      }
    } catch (err) {
      console.log("Error updating task:", err);
    }
  };

  const removeTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  const markAsCompleted = async (id) => {
    const updatedTask = {
      is_completed: true,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: true } : task
          )
        );
      } else {
        console.error("Failed to mark task as completed");
      }
    } catch (err) {
      console.log("Error marking task as completed:", err);
    }
  };

  const handleFilterChange = (filter) => {
    setFilteredTasks(filter);
  };

  const filteredTasksList = tasks.filter((task) => {
    if (filteredTasks === "completed") return task.completed;
    if (filteredTasks === "pending") return !task.completed;
    return true;
  });

  return (
    <div className={`todo-container ${isDarkMode ? "dark-mode" : ""}`}>
      <input
        type="text"
        placeholder="Add a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className={isDarkMode ? "dark-input" : ""}
      />
      <button onClick={addTask} className={isDarkMode ? "dark-button" : ""}>
        Add Task
      </button>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => handleFilterChange("all")}
          className={isDarkMode ? "dark-button" : ""}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("completed")}
          className={isDarkMode ? "dark-button" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => handleFilterChange("pending")}
          className={isDarkMode ? "dark-button" : ""}
        >
          Pending
        </button>
      </div>

      <div className="task-list-container">
        <ul>
          {filteredTasksList.map((task) => (
            <li
              key={task.id}
              className={isDarkMode ? "dark-li" : ""}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#6c757d" : "#000",
              }}
            >
              {editIndex === task.id ? (
                <div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={isDarkMode ? "dark-input" : ""}
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className={isDarkMode ? "dark-button" : ""}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="task-content">
                  <div className="task-title">
                    <h3 className={isDarkMode ? "dark-title" : ""}>
                      {task.title}
                    </h3>
                  </div>
                  <div className="task-buttons">
                    <button
                      onClick={() => {
                        setEditIndex(task.id);
                        setNewTitle(task.title);
                      }}
                      className={isDarkMode ? "dark-button" : ""}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeTask(task.id)}
                      className={isDarkMode ? "dark-button" : ""}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => markAsCompleted(task.id)}
                      className={isDarkMode ? "dark-button" : ""}
                    >
                      {task.completed ? "Completed" : "Complete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
