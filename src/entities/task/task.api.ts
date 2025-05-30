import { graphqlClient } from "../../shared/api/graphqlClient";
import type { Task } from "./task.types";

const GET_TASKS = `
  query GetAllTasks {
    tasks {
      id
      title
      description
      assignee_id
      assignee {
        id
        first_name
        last_name
      }
      task_labels {
        label {
          id
          caption
          color
        }
      }
    }
  }
`;

const GET_TASK_BY_ID = `
  query GetTaskById($id: Int!) {
    tasks_by_pk(id: $id) {
      id
      title
      description
      assignee_id
      assignee {
        id
        first_name
        last_name
      }
      task_labels {
        label {
          id
          caption
          color
        }
      }
    }
  }
`;

const CREATE_TASK_MUTATION = `
  mutation CreateTask($title: String!, $description: String, $assignee_id: Int, $labels: [task_labels_insert_input!]!) {
    insert_tasks_one(object: {
      title: $title,
      description: $description,
      assignee_id: $assignee_id,
      task_labels: { data: $labels }
    }) {
      id
      title
    }
  }
`;

const UPDATE_TASK_MUTATION = `
  mutation UpdateTask(
    $id: Int!,
    $title: String!,
    $description: String,
    $assignee_id: Int,
    $labels: [task_labels_insert_input!]!
  ) {
    update_tasks_by_pk(
      pk_columns: { id: $id },
      _set: {
        title: $title,
        description: $description,
        assignee_id: $assignee_id
      }
    ) {
      id
    }

    delete_task_labels(where: { task_id: { _eq: $id } }) {
      affected_rows
    }

    insert_task_labels(objects: $labels) {
      affected_rows 
    }
  }
`;

const DELETE_TASK_MUTATION = `
  mutation DeleteTask($id: Int!) {
    delete_tasks_by_pk(id: $id) {
      id
    }
  }
`;

export const getTasks = async (): Promise<Task[]> => {
  const result = await graphqlClient<{ tasks: Task[] }>({
    query: GET_TASKS,
  });

  return result.tasks;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const result = await graphqlClient<{
    tasks_by_pk: Task | null;
  }>({
    query: GET_TASK_BY_ID,
    variables: { id },
  });

  return result.tasks_by_pk;
};

export const createTask = async (
  title: string,
  description: string | null,
  assignee_id: number | null,
  labels: { label_id: number }[]
) => {
  await graphqlClient({
    query: CREATE_TASK_MUTATION,
    variables: {
      title,
      description,
      assignee_id,
      labels,
    },
  });
};

export const updateTask = async (
  id: number,
  title: string,
  description: string | null,
  assignee_id: number | null,
  labels: { task_id: number; label_id: number }[]
) => {
  await graphqlClient({
    query: UPDATE_TASK_MUTATION,
    variables: {
      id,
      title,
      description,
      assignee_id,
      labels,
    },
  });
};

export const deleteTask = async (id: number) => {
  await graphqlClient({
    query: DELETE_TASK_MUTATION,
    variables: { id },
  });
};
