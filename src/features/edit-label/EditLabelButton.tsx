import React from "react";
import { Modal } from "../../shared/ui/Modal";
import { EditLabelForm } from "./EditLabelForm";
import './EditLabelButton.scss'
interface Props {
  label: {
    id: number;
    caption: string;
    color: string;
  };
  onUpdated: () => void;
}

export const EditLabelButton: React.FC<Props> = ({ label, onUpdated }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        className="label-edit-button"
        onClick={() => setIsModalOpen(true)}
      >
        ✏️ Редактировать
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Редактировать метку</h3>
        <EditLabelForm
          labelId={label.id}
          caption={label.caption}
          color={label.color}
          onUpdated={onUpdated}
        />
      </Modal>
    </>
  );
};
