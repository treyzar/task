import { Person, Add } from "@mui/icons-material";
import { useState } from "react";
import styles from "./Users.module.scss";
import { useUsers } from "../hooks/useUsers";
import Modal from "../components/Modal";
import UserForm from "../components/UserForm";
import type { User } from "../types";

export default function Users() {
  const { users, isLoading, error, createUser, updateUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>Произошла ошибка при загрузке данных</div>
    );
  }

  const handleSubmit = (data: Omit<User, "id" | "tasks">) => {
    if (selectedUser) {
      updateUser({ ...data, id: selectedUser.id });
    } else {
      createUser(data);
    }
  };

  return (
    <div className={styles.users}>
      <div className={styles.header}>
        <h1 className={styles.title}>Пользователи</h1>
        <button 
          className={styles.addButton}
          onClick={() => {
            setSelectedUser(undefined);
            setIsModalOpen(true);
          }}
        >
          <Add />
          Добавить пользователя
        </button>
      </div>

      <div className={styles.grid}>
        {users?.map((user) => (
          <div 
            key={user.id} 
            className={styles.card}
            onClick={() => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>
                <Person />
              </div>
              <div className={styles.userInfo}>
                <div className={styles.name}>
                  {`${user.first_name} ${user.last_name}`}
                </div>
                <div className={styles.role}>{user.bio || "Нет описания"}</div>
              </div>
            </div>
            {user.tasks && user.tasks.length > 0 && (
              <div className={styles.taskCount}>
                Активных задач: {user.tasks.length}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(undefined);
        }}
        title={selectedUser ? "Редактировать пользователя" : "Создать пользователя"}
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
