import React, { useState, useEffect, useContext } from "react";
import { getTasks } from "../api/api";
import TaskModal from "./TaskModal";
import { AuthContext } from "../context/AuthContext";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupBy, setGroupBy] = useState("none"); // 'none', 'date', 'responsible'
  const { isAuthenticated } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      console.log("Пользователь не авторизован");
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      console.log("Задачи с сервера:", response);
      setTasks(response);
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    fetchTasks();
  };

  const groupTasks = (tasks, groupBy) => {
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    switch (groupBy) {
      case "date":
        return {
          today: tasks.filter((task) => task.due_date.split("T")[0] === today),
          week: tasks.filter(
            (task) => task.due_date > today && task.due_date <= nextWeek
          ),
          future: tasks.filter((task) => task.due_date > nextWeek),
        };
      case "responsible":
        return tasks.reduce((acc, task) => {
          const key = task.responsible_id || "Без ответственного";
          if (!acc[key]) acc[key] = [];
          acc[key].push(task);
          return acc;
        }, {});
      default:
        return { all: tasks };
    }
  };

  const renderTasks = (tasks) => {
    return tasks.map((task) => (
      <li
        key={task.id}
        onClick={() => handleTaskClick(task)}
        style={{
          color:
            task.status === "выполнена"
              ? "green"
              : task.due_date < new Date().toISOString()
              ? "red"
              : "gray",
        }}
      >
        <strong>{task.title}</strong> - {task.priority} -{" "}
        {task.due_date.split("T")[0]} - {task.responsible_id} - {task.status}
      </li>
    ));
  };

  const groupedTasks = groupTasks(tasks, groupBy);

  return (
    <div className="taskList">
      <h2>Список задач</h2>
      <button onClick={() => setIsModalOpen(true)}>Новая задача</button>
      <button onClick={logout}>Выйти</button>
      <div>
        <label>
          Группировать по:
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="none">Без группировки</option>
            <option value="date">Дате завершения</option>
            <option value="responsible">Ответственным</option>
          </select>
        </label>
      </div>
      {groupBy === "date" ? (
        <>
          <h3>Задачи на сегодня</h3>
          <ul>{renderTasks(groupedTasks.today)}</ul>
          <h3>Задачи на неделю</h3>
          <ul>{renderTasks(groupedTasks.week)}</ul>
          <h3>Задачи на будущее</h3>
          <ul>{renderTasks(groupedTasks.future)}</ul>
        </>
      ) : groupBy === "responsible" ? (
        Object.entries(groupedTasks).map(([responsible, tasks]) => (
          <div key={responsible}>
            <h3>{responsible}</h3>
            <ul>{renderTasks(tasks)}</ul>
          </div>
        ))
      ) : (
        <ul>{renderTasks(groupedTasks.all)}</ul>
      )}
      {isModalOpen && (
        <TaskModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default TaskList;
