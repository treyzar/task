import React from "react";
import { graphqlClient } from "../../shared/api/graphqlClient";
import './DeleteTask.scss'
interface Props {
  taskId: number;
  onDeleted: () => void;
}

export const DeleteTaskButton: React.FC<Props> = ({ taskId, onDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить эту задачу?")) {
      await graphqlClient({
        query: `
          mutation DeleteTask($id: Int!) {
            delete_tasks_by_pk(id: $id) {
              id
            }
          }
        `,
        variables: { id: taskId },
      });

      onDeleted();
    }
  };

  return (
    <button type="button" className="task-delete-button" onClick={handleDelete}>
      🗑 Удалить
    </button>
  );
};
