import React, { useState, useEffect, useContext } from "react";
import { createTask, updateTask } from "../api/api";
import { getSubordinates } from "../api/api";

const TaskModal = ({ task, onClose }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate:
      task?.due_date.split("T")[0] || new Date().toISOString().split("T")[0],
    priority: task?.priority || "средний",
    status: task?.status || "к выполнению",
    responsible: task?.responsible_id || "",
  });

  const [subordinates, setSubordinates] = useState([]); // Состояние для хранения подчиненных

  // Загрузка подчиненных при монтировании компонента
  useEffect(() => {
    const fetchSubordinates = async () => {
      try {
        const data = await getSubordinates();
        setSubordinates(data);
      } catch (error) {
        console.error("Ошибка при загрузке подчиненных:", error);
      }
    };

    fetchSubordinates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (task) {
        // Если задача существует, обновляем её
        await updateTask(task.id, formData);
      } else {
        // Если задача новая, создаем её
        await createTask(formData);
      }
      onClose(); // Закрываем модальное окно после успешного сохранения
    } catch (error) {
      console.error("Ошибка при сохранении задачи:", error);
      alert("Не удалось сохранить задачу. Пожалуйста, попробуйте снова.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "30%",
        backgroundColor: "white",
        padding: "20px",
        border: "1px solid black",
      }}
    >
      <h2>{task ? "Редактировать задачу" : "Новая задача"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Заголовок"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Описание"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
        />
        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
        >
          <option value="высокий">Высокий</option>
          <option value="средний">Средний</option>
          <option value="низкий">Низкий</option>
        </select>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="к выполнению">К выполнению</option>
          <option value="выполняется">Выполняется</option>
          <option value="выполнена">Выполнена</option>
          <option value="отменена">Отменена</option>
        </select>
        <select
          value={formData.responsible}
          onChange={(e) =>
            setFormData({ ...formData, responsible: e.target.value })
          }
        >
          <option value="">Выберите ответственного</option>
          {subordinates.map((subordinate) => (
            <option key={subordinate.id} value={subordinate.id}>
              {subordinate.first_name} {subordinate.last_name}
            </option>
          ))}
        </select>
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onClose}>
          Закрыть
        </button>
      </form>
    </div>
  );
};

export default TaskModal;
