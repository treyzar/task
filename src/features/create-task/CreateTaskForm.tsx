import React from "react";
import { graphqlClient } from "../../shared/api/graphqlClient";
import { getUsers } from "../../entities/user/user.api";
import { getLabels } from "../../entities/label/label.api";
import type { User } from "../../entities/user/user.types";
import type { Label } from "../../entities/label/label.types";
import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";
import "./CreateTaskForm.scss";

const CREATE_TASK_MUTATION = `
  mutation CreateTask($title: String!, $description: String, $assignee_id: Int, $labels: [task_labels_insert_input!]!) {
    insert_tasks_one(object: {
      title: $title,
      description: $description,
      assignee_id: $assignee_id,
      task_labels: { data: $labels }
    }) {
      id
      title
    }
  }
`;

export const CreateTaskForm: React.FC<{
  onTaskCreated: () => void;
  onClose: () => void;
}> = ({ onTaskCreated, onClose }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState<number | "">("");
  const [selectedLabels, setSelectedLabels] = React.useState<number[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [labels, setLabels] = React.useState<Label[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const [usersData, labelsData] = await Promise.all([
        getUsers(),
        getLabels()
      ]);
      setUsers(usersData);
      setLabels(labelsData);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const labelsData = selectedLabels.map((id) => ({ label_id: id }));
    await graphqlClient({
      query: CREATE_TASK_MUTATION,
      variables: {
        title,
        description,
        assignee_id: assigneeId === "" ? null : assigneeId,
        labels: labelsData,
      },
    });
    onTaskCreated();
    onClose();
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setSelectedLabels([]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Создать задачу</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Заголовок</label>
            <Input
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Исполнитель</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(Number(e.target.value) || "")}
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
            <label>Метки</label>
            <div className="checkbox-list">
              {labels.map((label) => (
                <label key={label.id}>
                  <input
                    type="checkbox"
                    checked={selectedLabels.includes(label.id)}
                    onChange={(e) =>
                      setSelectedLabels(
                        e.target.checked
                          ? [...selectedLabels, label.id]
                          : selectedLabels.filter((id) => id !== label.id)
                      )
                    }
                  />
                  {label.caption}
                </label>
              ))}
            </div>
          </div>

          <Button>Создать задачу</Button>
        </form>
      </div>
    </div>
  );
};
