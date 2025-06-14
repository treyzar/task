import { useState } from 'react';
import type { Task, User, Label } from '../types';
import styles from './Form.module.scss';

interface TaskFormProps {
  task?: Task;
  users: User[];
  labels: Label[];
  onSubmit: (data: Omit<Task, 'id' | 'created_at'>) => void;
  onClose: () => void;
}

export default function TaskForm({ task, users, labels, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    selectedUser: task?.assignee?.id || '',
    selectedLabels: task?.labels?.map(l => l.id) || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedUser = users.find(u => u.id === Number(formData.selectedUser));
    const selectedLabels = labels.filter(l => formData.selectedLabels.includes(l.id));

    onSubmit({
      title: formData.title,
      description: formData.description,
      assignee: selectedUser || null,
      labels: selectedLabels,
    });
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="title">Название</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="assignee">Исполнитель</label>
        <select
          id="assignee"
          value={formData.selectedUser}
          onChange={e => setFormData(prev => ({ ...prev, selectedUser: e.target.value }))}
        >
          <option value="">Не назначен</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {`${user.first_name} ${user.last_name}`}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label>Метки</label>
        <div className={styles.labels}>
          {labels.map(label => (
            <label key={label.id} className={styles.labelCheckbox}>
              <input
                type="checkbox"
                checked={formData.selectedLabels.includes(label.id)}
                onChange={e => {
                  const newLabels = e.target.checked
                    ? [...formData.selectedLabels, label.id]
                    : formData.selectedLabels.filter(id => id !== label.id);
                  setFormData(prev => ({ ...prev, selectedLabels: newLabels }));
                }}
              />
              <span
                className={styles.labelColor}
                style={{ backgroundColor: label.color }}
              />
              <span className={styles.labelCaption}>{label.caption}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onClose}>
          Отмена
        </button>
        <button type="submit" className={styles.primaryButton}>
          {task ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
} 