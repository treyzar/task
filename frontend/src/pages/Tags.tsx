import { LocalOffer, Add } from "@mui/icons-material";
import { useState } from "react";
import styles from "./Tags.module.scss";
import { useLabels } from "../hooks/useLabels";
import Modal from "../components/Modal";
import LabelForm from "../components/LabelForm";
import type { Label } from "../types";

export default function Tags() {
  const { labels, isLoading, error, createLabel, updateLabel } = useLabels();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | undefined>();

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>Произошла ошибка при загрузке данных</div>
    );
  }

  const handleSubmit = (data: Omit<Label, "id" | "tasks">) => {
    if (selectedLabel) {
      updateLabel({ ...data, id: selectedLabel.id });
    } else {
      createLabel(data);
    }
  };

  return (
    <div className={styles.tags}>
      <div className={styles.header}>
        <h1 className={styles.title}>Метки</h1>
        <button
          className={styles.addButton}
          onClick={() => {
            setSelectedLabel(undefined);
            setIsModalOpen(true);
          }}
        >
          <Add />
          Добавить метку
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {labels?.map((label) => (
            <div
              key={label.id}
              className={styles.tag}
              style={{
                background: `linear-gradient(135deg, ${label.color}dd, ${label.color}ff)`,
              }}
              onClick={() => {
                setSelectedLabel(label);
                setIsModalOpen(true);
              }}
            >
              <LocalOffer />
              <span>{label.caption}</span>
              {label.tasks && (
                <span className={styles.count}>{label.tasks.length}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLabel(undefined);
        }}
        title={selectedLabel ? "Редактировать метку" : "Создать метку"}
      >
        <LabelForm
          label={selectedLabel}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLabel(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
