import { Assignment, Schedule, Add } from "@mui/icons-material";
import { useEffect } from "react";
import styles from "./Tasks.module.scss";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import type { Task } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTasks, createTask, updateTask } from "../store/slices/tasksSlice";
import { fetchUsers } from "../store/slices/usersSlice";
import { fetchLabels } from "../store/slices/labelsSlice";
import { openModal, closeModal } from "../store/slices/modalSlice";

export default function Tasks() {
  const dispatch = useAppDispatch();
  const { items: tasks, isLoading: tasksLoading, error: tasksError } = useAppSelector(state => state.tasks);
  const { items: users, isLoading: usersLoading } = useAppSelector(state => state.users);
  const { items: labels, isLoading: labelsLoading } = useAppSelector(state => state.labels);
  const { isOpen: isModalOpen, selectedTask } = useAppSelector(state => state.modal);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
    dispatch(fetchLabels());
  }, [dispatch]);

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
      dispatch(updateTask({
        ...data,
        id: selectedTask.id,
        created_at: selectedTask.created_at,
      }));
    } else {
      dispatch(createTask(data));
    }
    dispatch(closeModal());
  };

  return (
    <div className={styles.tasks}>
      <div className={styles.header}>
        <h1 className={styles.title}>Задачи</h1>
        <button
          className={styles.addButton}
          onClick={() => dispatch(openModal(undefined))}
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
            onClick={() => dispatch(openModal(task))}
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
        onClose={() => dispatch(closeModal())}
        title={selectedTask ? "Редактировать задачу" : "Создать задачу"}
      >
        <TaskForm
          task={selectedTask}
          users={users || []}
          labels={labels || []}
          onSubmit={handleSubmit}
          onClose={() => dispatch(closeModal())}
        />
      </Modal>
    </div>
  );
}
