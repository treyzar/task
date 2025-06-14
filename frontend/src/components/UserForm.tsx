import { useState } from 'react';
import type { User } from '../types';
import styles from './Form.module.scss';

interface UserFormProps {
  user?: User;
  onSubmit: (data: Omit<User, 'id' | 'tasks'>) => void;
  onClose: () => void;
}

export default function UserForm({ user, onSubmit, onClose }: UserFormProps) {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="first_name">Имя</label>
        <input
          type="text"
          id="first_name"
          value={formData.first_name}
          onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="last_name">Фамилия</label>
        <input
          type="text"
          id="last_name"
          value={formData.last_name}
          onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="bio">О себе</label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onClose}>
          Отмена
        </button>
        <button type="submit" className={styles.primaryButton}>
          {user ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
} 