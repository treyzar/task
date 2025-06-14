CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    bio TEXT
);

CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    caption TEXT NOT NULL,
    color TEXT NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE task_labels (
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    label_id INTEGER REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);

-- Add some sample data
INSERT INTO users (first_name, last_name, bio) VALUES
    ('John', 'Doe', 'Frontend Developer'),
    ('Jane', 'Smith', 'Backend Developer');

INSERT INTO labels (caption, color) VALUES
    ('Bug', '#ff0000'),
    ('Feature', '#00ff00'),
    ('Enhancement', '#0000ff');

INSERT INTO tasks (title, description, assignee_id) VALUES
    ('Fix login page', 'The login page is not working properly', 1),
    ('Add dark theme', 'Implement dark theme support', 2);

INSERT INTO task_labels (task_id, label_id) VALUES
    (1, 1),  -- Bug for login page
    (2, 2);  -- Feature for dark theme 