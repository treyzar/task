import React from "react";
import { getLabels } from "../../entities/label/label.api";
import { LabelCard } from "./LabelCard";
import { CreateLabelForm } from "../../features/create-label/CreateLabelForm";
import type { Label } from "../../entities/label/label.types";
import { Modal } from "../../shared/ui/Modal";
import { Button } from "../../shared/ui/Button";
import "./LabelsPage.scss";

export const LabelsPage: React.FC = () => {
  const [labels, setLabels] = React.useState<Label[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const data = await getLabels();
      setLabels(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleCreate = async () => {
    const data = await getLabels();
    setLabels(data);
    setIsModalOpen(false);
  };

  return (
    <div className="labels-page">
      <h2>Метки</h2>

      <Button onClick={() => setIsModalOpen(true)}>+ Новая метка</Button>

      <div className="labels-grid">
        {loading ? (
          <p>Загрузка...</p>
        ) : labels.length > 0 ? (
          labels.map((label) => (
            <LabelCard key={label.id} label={label} onDeleted={handleCreate} />
          ))
        ) : (
          <p>Нет меток</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Создать метку</h3>
        <CreateLabelForm onCreate={handleCreate} />
      </Modal>
    </div>
  );
};
