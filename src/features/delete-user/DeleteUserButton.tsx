import React from "react";
import { graphqlClient } from "../../shared/api/graphqlClient";
import "./DeleteUserButton.scss";

const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: Int!) {
    delete_users_by_pk(id: $id) {
      id
    }
  }
`;

interface Props {
  userId: number;
  onDeleted: () => void;
}

export const DeleteUserButton: React.FC<Props> = ({ userId, onDeleted }) => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleDelete = async () => {
    await graphqlClient({
      query: DELETE_USER_MUTATION,
      variables: { id: userId },
    });
    onDeleted();
    setIsConfirmOpen(false);
  };

  return (
    <>
      <button
        className="delete-user-button"
        onClick={() => setIsConfirmOpen(true)}
        type="button"
      >
        🗑️ Удалить
      </button>

      {isConfirmOpen && (
        <div className="modal-overlay" onClick={() => setIsConfirmOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Подтверждение удаления</h3>
            <p className="confirm-text">
              Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.
            </p>
            <div className="confirm-buttons">
              <button
                className="confirm-button confirm-button--cancel"
                onClick={() => setIsConfirmOpen(false)}
              >
                Отмена
              </button>
              <button
                className="confirm-button confirm-button--delete"
                onClick={handleDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 