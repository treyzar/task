import React from "react";
import { EditLabelButton } from "../../features/edit-label/EditLabelButton";
import { graphqlClient } from "../../shared/api/graphqlClient";
import './LabelCard.scss'
interface Props {
  label: {
    id: number;
    caption: string;
    color: string;
  };
  onDeleted: () => void;
}

export const LabelCard: React.FC<Props> = ({ label, onDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm("Удалить метку?")) {
      await graphqlClient({
        query: `
          mutation DeleteLabel($id: Int!) {
            delete_labels_by_pk(id: $id) {
              id
            }
          }
        `,
        variables: { id: label.id },
      });
      onDeleted();
    }
  };

  return (
    <div className="label-card">
      <div className="label-header">
        <h3>{label.caption}</h3>
      </div>
      <div className="label-body">
        <p>
          Цвет:
          <span
            className="label-color"
            style={{ backgroundColor: label.color }}
          >
            {label.color}
          </span>
        </p>
      </div>
      <div className="label-footer">
        <EditLabelButton label={label} onUpdated={onDeleted} />
        <button
          type="button"
          className="label-delete-button"
          onClick={handleDelete}
        >
          🗑 Удалить
        </button>
      </div>
    </div>
  );
};
