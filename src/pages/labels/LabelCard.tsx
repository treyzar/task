import React from "react";
import { DeleteLabelButton } from "../../features/delete-label/DeleteLabelButton";
import type { Label } from "../../entities/label/label.types";
import { Modal } from "../../shared/ui/Modal";
import { EditLabelForm } from "../../features/edit-label/EditLabelForm";
import './LabelCard.scss'

interface Props {
  label: Label;
  onDeleted: () => void;
}

export const LabelCard: React.FC<Props> = ({ label, onDeleted }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <div 
        className="label-card"
        style={{ "--label-color": label.color } as React.CSSProperties}
      >
        <div className="label-card__header">
          <div 
            className="label-card__color"
            style={{ backgroundColor: label.color }}
          />
          <h3 className="label-card__title">{label.caption}</h3>
        </div>
        
        <div className="label-card__actions">
          <button className="edit-button" onClick={() => setIsModalOpen(true)}>
            ✏️ Редактировать
          </button>
          <DeleteLabelButton labelId={label.id} onDeleted={onDeleted} />
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <div className="modal-content">
          <h3 className="modal-title">Редактировать метку</h3>
          <EditLabelForm
            labelId={label.id}
            caption={label.caption}
            color={label.color}
            onUpdated={() => {
              onDeleted();
              setIsModalOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
};
