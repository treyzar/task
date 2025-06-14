import { Assignment, Schedule, Add } from "@mui/icons-material";
import { useState } from "react";
import styles from "./Tasks.module.scss";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { useLabels } from "../hooks/useLabels";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import type { Task } from "../types";

export default function Tasks() {
  const { tasks, isLoading: tasksLoading, error: tasksError, createTask, updateTask } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();
  const { labels, isLoading: labelsLoading } = useLabels();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const isLoading = tasksLoading || usersLoading || labelsLoading;

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (tasksError) {
    return (
      <div className={styles.error}>Произошла ошибка при загрузке данных</div>
    );
  }

  const handleSubmit = (data: Omit<Task, "id" | "created_at">) => {
    if (selectedTask) {
      updateTask({
        ...data,
        id: selectedTask.id,
        created_at: selectedTask.created_at,
      });
    } else {
      createTask(data);
    }
  };

  return (
    <div className={styles.tasks}>
      <div className={styles.header}>
        <h1 className={styles.title}>Задачи</h1>
        <button
          className={styles.addButton}
          onClick={() => {
            setSelectedTask(undefined);
            setIsModalOpen(true);
          }}
        >
          <Add />
          Добавить задачу
        </button>
      </div>

      <div className={styles.grid}>
        {tasks?.map((task) => (
          <div
            key={task.id}
            className={styles.card}
            onClick={() => {
              setSelectedTask(task);
              setIsModalOpen(true);
            }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.icon}>
                <Assignment />
              </div>
              <h2 className={styles.taskTitle}>{task.title}</h2>
            </div>

            <div className={styles.taskInfo}>
              <div className={styles.date}>
                <Schedule />
                <span>
                  {new Date(task.created_at).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              {task.assignee && (
                <div className={styles.assignee}>
                  Исполнитель:{" "}
                  {`${task.assignee.first_name} ${task.assignee.last_name}`}
                </div>
              )}
              {task.labels && task.labels.length > 0 && (
                <div className={styles.tags}>
                  {task.labels.map((label) => (
                    <span
                      key={label.id}
                      className={styles.tag}
                      style={{ backgroundColor: label.color }}
                    >
                      {label.caption}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {task.description && (
              <div className={styles.description}>{task.description}</div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        title={selectedTask ? "Редактировать задачу" : "Создать задачу"}
      >
        <TaskForm
          task={selectedTask}
          users={users || []}
          labels={labels || []}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
