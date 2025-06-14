import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../lib/graphql";
import type { Task, User, Label } from "../types";

interface TasksResponse {
  tasks: Array<{
    id: number;
    title: string;
    description: string | null;
    created_at: string;
    assignee: {
      id: number;
      first_name: string;
      last_name: string;
      bio: string | null;
    } | null;
    task_labels: Array<{
      label: {
        id: number;
        caption: string;
        color: string;
      };
    }>;
  }>;
}

interface CreateTaskResponse {
  insert_tasks_one: {
    id: number;
    title: string;
    description: string | null;
    assignee_id: number | null;
  };
}

interface UpdateTaskResponse {
  update_tasks_by_pk: {
    id: number;
    title: string;
    description: string | null;
    assignee_id: number | null;
    created_at: string;
  };
}

interface AddTaskLabelsResponse {
  insert_task_labels: {
    affected_rows: number;
  };
}

interface DeleteTaskLabelsResponse {
  delete_task_labels: {
    affected_rows: number;
  };
}

const GET_TASKS = `
  query GetTasks {
    tasks(order_by: [{created_at: desc}, {id: asc}]) {
      id
      title
      description
      created_at
      assignee {
        id
        first_name
        last_name
        bio
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

const CREATE_TASK = `
  mutation CreateTask($title: String!, $description: String, $assignee_id: Int) {
    insert_tasks_one(object: {
      title: $title,
      description: $description,
      assignee_id: $assignee_id
    }) {
      id
      title
      description
      assignee_id
    }
  }
`;

const UPDATE_TASK = `
  mutation UpdateTask($id: Int!, $title: String!, $description: String, $assignee_id: Int) {
    update_tasks_by_pk(
      pk_columns: { id: $id }
      _set: {
        title: $title,
        description: $description,
        assignee_id: $assignee_id
      }
    ) {
      id
      title
      description
      assignee_id
      created_at
    }
  }
`;

const ADD_TASK_LABELS = `
  mutation AddTaskLabels($objects: [task_labels_insert_input!]!) {
    insert_task_labels(objects: $objects) {
      affected_rows
    }
  }
`;

const DELETE_TASK_LABELS = `
  mutation DeleteTaskLabels($task_id: Int!) {
    delete_task_labels(where: { task_id: { _eq: $task_id } }) {
      affected_rows
    }
  }
`;

export function useTasks() {
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { tasks } = await graphqlClient.request<TasksResponse>(GET_TASKS);
      return tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        created_at: task.created_at,
        assignee: task.assignee as User | null,
        labels: task.task_labels.map((tl) => tl.label) as Label[],
      }));
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, "id" | "created_at">) => {
      const { title, description } = newTask;
      const assignee_id = newTask.assignee?.id;
      
      const { insert_tasks_one } = await graphqlClient.request<CreateTaskResponse>(
        CREATE_TASK,
        {
          title,
          description,
          assignee_id,
        }
      );

      if (newTask.labels && newTask.labels.length > 0) {
        const objects = newTask.labels.map((label) => ({
          task_id: insert_tasks_one.id,
          label_id: label.id,
        }));

        await graphqlClient.request<AddTaskLabelsResponse>(ADD_TASK_LABELS, {
          objects,
        });
      }

      return insert_tasks_one;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Task) => {
      const { title, description } = updateData;
      const assignee_id = updateData.assignee?.id;
      
      const { update_tasks_by_pk } = await graphqlClient.request<UpdateTaskResponse>(
        UPDATE_TASK,
        {
          id,
          title,
          description,
          assignee_id,
        }
      );

      await graphqlClient.request<DeleteTaskLabelsResponse>(DELETE_TASK_LABELS, {
        task_id: id,
      });

      if (updateData.labels && updateData.labels.length > 0) {
        const objects = updateData.labels.map((label) => ({
          task_id: id,
          label_id: label.id,
        }));

        await graphqlClient.request<AddTaskLabelsResponse>(ADD_TASK_LABELS, {
          objects,
        });
      }

      return update_tasks_by_pk;
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(["tasks"], old => {
          if (!old) return old;
          return old.map(task => 
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          );
        });
      }

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
  };
}
