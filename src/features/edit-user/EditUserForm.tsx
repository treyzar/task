import React from "react";
import { graphqlClient } from "../../shared/api/graphqlClient";
import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";
import type { User } from "../../entities/user/user.types";
import "./EditUserForm.scss";

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: Int!, $first_name: String!, $last_name: String!, $bio: String) {
    update_users_by_pk(
      pk_columns: { id: $id },
      _set: {
        first_name: $first_name,
        last_name: $last_name,
        bio: $bio
      }
    ) {
      id
      first_name
      last_name
    }
  }
`;

interface Props {
  user: User;
  onUserUpdated: () => void;
  onClose: () => void;
}

export const EditUserForm: React.FC<Props> = ({ user, onUserUpdated, onClose }) => {
  const [firstName, setFirstName] = React.useState(user.first_name);
  const [lastName, setLastName] = React.useState(user.last_name);
  const [bio, setBio] = React.useState(user.bio || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await graphqlClient({
      query: UPDATE_USER_MUTATION,
      variables: {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        bio: bio || null,
      },
    });
    onUserUpdated();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-user-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="edit-user-title">Редактировать пользователя</h2>

        <form onSubmit={handleSubmit} className="edit-user-form">
          <div className="form-group">
            <label className="form-label">Имя</label>
            <Input
              placeholder="Введите имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Фамилия</label>
            <Input
              placeholder="Введите фамилию"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">О себе</label>
            <textarea
              placeholder="Расскажите о себе"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-textarea"
            />
          </div>

          <Button type="submit" className="form-submit">
            Сохранить изменения
          </Button>
        </form>
      </div>
    </div>
  );
}; 