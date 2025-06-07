import React from "react";
import { getUsers, getUserById } from "../../entities/user/user.api";
import type { User } from "../../entities/user/user.types";
import { CreateUserForm } from "../../features/create-user/CreateUserForm";
import { EditUserForm } from "../../features/edit-user/EditUserForm";
import { DeleteUserButton } from "../../features/delete-user/DeleteUserButton";
import { Button } from "../../shared/ui/Button";
import "./UsersPage.scss";

export const UsersPage: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  const handleUserUpdate = async (userId: number) => {
    const updatedUser = await getUserById(userId);
    if (updatedUser) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? updatedUser : user
        )
      );
    }
  };

  const handleUserDelete = () => {
    loadUsers();
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Пользователи</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          + Добавить пользователя
        </Button>
      </div>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-card__content">
              <h3 className="user-name">
                {user.first_name} {user.last_name}
              </h3>
              {user.bio && <p className="user-bio">{user.bio}</p>}
            </div>
            <div className="user-card__actions">
              <button
                className="edit-user-button"
                onClick={() => setEditingUser(user)}
              >
                ✏️ Редактировать
              </button>
              <DeleteUserButton userId={user.id} onDeleted={handleUserDelete} />
            </div>
          </div>
        ))}
      </div>

      {isCreateModalOpen && (
        <CreateUserForm
          onUserCreated={() => {
            loadUsers();
            setIsCreateModalOpen(false);
          }}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onUserUpdated={() => {
            handleUserUpdate(editingUser.id);
            setEditingUser(null);
          }}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};


