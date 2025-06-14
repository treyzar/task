import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskInput, TaskResponse } from "../../types";
import { gql } from "@apollo/client";
import { client } from "../../lib/apollo";

interface TasksState {
  items: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  isLoading: false,
  error: null,
};

const transformTaskResponse = (response: TaskResponse): Task => ({
  id: response.id,
  title: response.title,
  description: response.description,
  created_at: response.created_at,
  assignee_id: response.assignee_id,
  assignee: response.assignee,
  labels: response.task_labels.map(tl => tl.label),
});

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const { data } = await client.query<{ tasks: TaskResponse[] }>({
    query: gql`
      query GetTasks {
        tasks(order_by: { created_at: desc }) {
          id
          title
          description
          created_at
          assignee_id
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
    `,
  });

  return data.tasks.map(transformTaskResponse);
});

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (input: TaskInput) => {
    const { labels, ...taskData } = input;
    
    const { data: createResponse } = await client.mutate<{ insert_tasks_one: TaskResponse }>({
      mutation: gql`
        mutation CreateTask($task: tasks_insert_input!) {
          insert_tasks_one(object: $task) {
            id
            title
            description
            created_at
            assignee_id
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
      `,
      variables: {
        task: taskData,
      },
    });

    if (!createResponse?.insert_tasks_one) {
      throw new Error('Failed to create task');
    }

    const newTask = createResponse.insert_tasks_one;

    if (labels && labels.length > 0) {
      await client.mutate({
        mutation: gql`
          mutation CreateTaskLabels($objects: [task_labels_insert_input!]!) {
            insert_task_labels(objects: $objects) {
              affected_rows
              returning {
                task_id
                label_id
                label {
                  id
                  caption
                  color
                }
              }
            }
          }
        `,
        variables: {
          objects: labels.map(label => ({
            task_id: newTask.id,
            label_id: label.id,
          })),
        },
      });
    }

    return transformTaskResponse(newTask);
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task) => {
    const { id, labels, created_at, ...taskData } = task;

    await client.mutate({
      mutation: gql`
        mutation UpdateTask($id: Int!, $task: tasks_set_input!) {
          update_tasks_by_pk(pk_columns: { id: $id }, _set: $task) {
            id
            title
            description
            created_at
            assignee_id
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
      `,
      variables: {
        id,
        task: taskData,
      },
    });

    if (labels) {
      await client.mutate({
        mutation: gql`
          mutation DeleteTaskLabels($task_id: Int!) {
            delete_task_labels(where: { task_id: { _eq: $task_id } }) {
              affected_rows
            }
          }
        `,
        variables: {
          task_id: id,
        },
      });

      if (labels.length > 0) {
        await client.mutate({
          mutation: gql`
            mutation CreateTaskLabels($objects: [task_labels_insert_input!]!) {
              insert_task_labels(objects: $objects) {
                affected_rows
                returning {
                  task_id
                  label_id
                  label {
                    id
                    caption
                    color
                  }
                }
              }
            }
          `,
          variables: {
            objects: labels.map(label => ({
              task_id: id,
              label_id: label.id,
            })),
          },
        });
      }
    }

    const { data } = await client.query<{ tasks_by_pk: TaskResponse }>({
      query: gql`
        query GetTask($id: Int!) {
          tasks_by_pk(id: $id) {
            id
            title
            description
            created_at
            assignee_id
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
      `,
      variables: { id },
    });

    if (!data?.tasks_by_pk) {
      throw new Error('Failed to fetch updated task');
    }

    return transformTaskResponse(data.tasks_by_pk);
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Произошла ошибка при загрузке задач";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default tasksSlice.reducer; 