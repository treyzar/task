import React from "react";
import { useParams, Link } from "react-router-dom";
import { getTaskById } from "../../entities/task/task.api";
import type { Task } from "../../entities/task/task.types";
import "./TaskDetailsPage.scss";

export const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams();
  const [task, setTask] = React.useState<Task | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadTask = async () => {
      if (!taskId) return;
      const data = await getTaskById(Number(taskId));
      setTask(data);
      setLoading(false);
    };
    loadTask();
  }, [taskId]);

  if (loading) return <div className="task-details__loading">Загрузка...</div>;
  if (!task)
    return <div className="task-details__not-found">Задача не найдена</div>;

  return (
    <div className="task-details">
      <Link to="/tasks" className="task-details__back-link">
        ← Назад к списку задач
      </Link>

      <h2 className="task-details__title">{task.title}</h2>

      <div className="task-details__section">
        <strong>Описание:</strong>
        <p>{task.description || "Описание отсутствует"}</p>
      </div>

      <div className="task-details__section">
        <strong>Исполнитель:</strong>
        <p>
          {task.assignee
            ? `${task.assignee.first_name} ${task.assignee.last_name}`
            : "Не назначен"}
        </p>
      </div>

      <div className="task-details__section">
        <strong>Метки:</strong>
        <div className="task-details__labels">
          {task.task_labels.length === 0 && <span>Нет меток</span>}
          {task.task_labels.map(({ label }) => (
            <span
              key={label.id}
              className="task-details__label-tag"
              style={{ backgroundColor: label.color }}
            >
              {label.caption}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
