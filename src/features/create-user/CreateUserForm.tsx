import React from "react";
import { graphqlClient } from "../../shared/api/graphqlClient";
import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";
import "./CreateUserForm.scss";

const CREATE_USER_MUTATION = `
  mutation CreateUser($first_name: String!, $last_name: String!, $bio: String) {
    insert_users_one(object: {
      first_name: $first_name,
      last_name: $last_name,
      bio: $bio
    }) {
      id
      first_name
      last_name
    }
  }
`;

interface Props {
  onUserCreated: () => void;
  onClose: () => void;
}

export const CreateUserForm: React.FC<Props> = ({ onUserCreated, onClose }) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [bio, setBio] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await graphqlClient({
      query: CREATE_USER_MUTATION,
      variables: {
        first_name: firstName,
        last_name: lastName,
        bio: bio || null,
      },
    });
    onUserCreated();
    onClose();
    setFirstName("");
    setLastName("");
    setBio("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-user-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="create-user-title">Создать пользователя</h2>

        <form onSubmit={handleSubmit} className="create-user-form">
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
            Создать пользователя
          </Button>
        </form>
      </div>
    </div>
  );
}; 