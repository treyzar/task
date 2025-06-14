import { useState } from 'react';
import type { Label } from '../types';
import styles from './Form.module.scss';

interface LabelFormProps {
  label?: Label;
  onSubmit: (data: Omit<Label, 'id' | 'tasks'>) => void;
  onClose: () => void;
}

export default function LabelForm({ label, onSubmit, onClose }: LabelFormProps) {
  const [formData, setFormData] = useState({
    caption: label?.caption || '',
    color: label?.color || '#8b5cf6',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="caption">Название</label>
        <input
          type="text"
          id="caption"
          value={formData.caption}
          onChange={e => setFormData(prev => ({ ...prev, caption: e.target.value }))}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="color">Цвет</label>
        <div className={styles.colorField}>
          <input
            type="color"
            id="color"
            value={formData.color}
            onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
            className={styles.colorInput}
          />
          <input
            type="text"
            value={formData.color}
            onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
            className={styles.colorText}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onClose}>
          Отмена
        </button>
        <button type="submit" className={styles.primaryButton}>
          {label ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
} 