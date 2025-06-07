import React from "react";
import { deleteLabel } from "../../entities/label/label.api";

interface Props {
  labelId: number;
  onDeleted: () => void;
}

export const DeleteLabelButton: React.FC<Props> = ({ labelId, onDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить эту метку?")) {
      await deleteLabel(labelId);
      onDeleted();
    }
  };

  return (
    <button className="delete-button" onClick={handleDelete}>
      🗑️ Удалить
    </button>
  );
}; 