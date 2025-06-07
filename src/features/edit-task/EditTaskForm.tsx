import React from "react";
import { getUsers } from "../../entities/user/user.api";
import { getLabels } from "../../entities/label/label.api";
import type { User } from "../../entities/user/user.types";
import type { Label } from "../../entities/label/label.types";
import { updateTask } from "../../entities/task/task.api";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import "./EditTaskForm.scss";
import { getTaskById } from "../../entities/task/task.api";

interface Props {
  taskId: number;
  onTaskUpdated: () => void;
  onClose: () => void;
}

export const EditTaskForm: React.FC<Props> = ({
  taskId,
  onTaskUpdated,
  onClose,
}) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState<string | null>(null);
  const [assigneeId, setAssigneeId] = React.useState<number | "">("");
  const [selectedLabels, setSelectedLabels] = React.useState<number[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [labels, setLabels] = React.useState<Label[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const [usersData, labelsData] = await Promise.all([
        getUsers(),
        getLabels(),
      ]);
      setUsers(usersData);
      setLabels(labelsData);

      const task = await getTaskById(taskId);
      if (task) {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setAssigneeId(task.assignee_id || "");
        setSelectedLabels(task.task_labels.map((tl) => tl.label.id));
      }
    };
    load();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const labelsData = selectedLabels.map((label_id) => ({
      task_id: taskId,
      label_id,
    }));

    await updateTask(
      taskId,
      title,
      description,
      assigneeId === "" ? null : Number(assigneeId),
      labelsData
    );

    onTaskUpdated();
    onClose();
  };

  const handleCheckLabel = (labelId: number, checked: boolean) => {
    setSelectedLabels(
      checked
        ? [...selectedLabels, labelId]
        : selectedLabels.filter((id) => id !== labelId)
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-task-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="edit-task-title">Редактировать задачу</h2>

        <form onSubmit={handleSubmit} className="edit-task-form">
          <div className="form-group">
            <label className="form-label">Заголовок</label>
            <Input
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              placeholder="Описание"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Исполнитель</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(Number(e.target.value) || "")}
              className="form-select"
            >
              <option value="">Без исполнителя</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Метки</label>
            <div className="checkbox-list">
              {labels.map((label) => (
                <label key={label.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedLabels.includes(label.id)}
                    onChange={(e) =>
                      handleCheckLabel(label.id, e.target.checked)
                    }
                  />
                  {label.caption}
                </label>
              ))}
            </div>
          </div>

          <Button>Сохранить</Button>
        </form>
      </div>
    </div>
  );
};
