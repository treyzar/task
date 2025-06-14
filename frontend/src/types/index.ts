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
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  assignee?: User | null;
  labels?: Label[];
}

export interface TaskLabel {
  task_id: number;
  label_id: number;
  task?: Task;
  label?: Label;
}
