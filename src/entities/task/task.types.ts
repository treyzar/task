export type Label = {
  id: number;
  caption: string;
  color: string;
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  bio: string | null;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  assignee_id: number | null;
  assignee: User | null;
  task_labels: Array<{
    label: Label;
  }>;
};
