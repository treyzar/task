export interface User {
  id: number;
  first_name: string;
  last_name: string;
  bio: string | null;
  tasks?: Task[];
}

export interface Label {
  id: number;
  caption: string;
  color: string;
  task_labels?: TaskLabel[];
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  assignee_id?: number | null;
  assignee?: User | null;
  labels?: Label[];
}

export interface TaskLabel {
  task_id: number;
  label_id: number;
  task?: Task;
  label?: Label;
}

export interface TaskInput {
  title: string;
  description: string | null;
  assignee_id?: number | null;
  assignee?: User | null;
  labels?: Label[];
}

export interface TaskResponse {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  assignee_id: number | null;
  assignee: User | null;
  task_labels: Array<{
    label: Label;
  }>;
}
