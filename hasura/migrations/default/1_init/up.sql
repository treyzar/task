-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    bio TEXT
);

-- Создание таблицы меток
CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    caption TEXT NOT NULL,
    color TEXT NOT NULL
);

-- Создание таблицы задач
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assignee_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Создание промежуточной таблицы для связи многие-ко-многим между tasks и labels
CREATE TABLE task_labels (
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    label_id INTEGER REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);

-- Добавление индексов для ускорения запросов
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_task_labels_task ON task_labels(task_id);
CREATE INDEX idx_task_labels_label ON task_labels(label_id);

-- Добавление тестовых пользователей
INSERT INTO users (first_name, last_name, bio) VALUES
    ('Иван', 'Иванов', 'Руководитель проекта'),
    ('Петр', 'Петров', 'Старший разработчик'),
    ('Анна', 'Сидорова', 'UI/UX дизайнер'),
    ('Мария', 'Кузнецова', 'Тестировщик');

-- Добавление тестовых меток
INSERT INTO labels (caption, color) VALUES
    ('Срочно', '#FF0000'),
    ('Баг', '#FF6600'),
    ('Улучшение', '#3399FF'),
    ('Документация', '#33CC33'),
    ('Дизайн', '#9966FF');

-- Добавление тестовых задач
INSERT INTO tasks (title, description, assignee_id) VALUES
    ('Исправить ошибку авторизации', 'Пользователи не могут войти в систему после обновления', 2),
    ('Обновить документацию API', 'Добавить описание новых эндпоинтов', 1),
    ('Редизайн главной страницы', 'Изменить расположение элементов согласно новому макету', 3),
    ('Добавить тесты для модуля оплаты', 'Написать unit-тесты для новой платежной системы', 4),
    ('Оптимизировать запросы к базе данных', 'Улучшить производительность на странице списка пользователей', 2),
    ('Подготовить презентацию для клиента', 'Создать слайды с описанием новых функций', 1);

-- Добавление связей между задачами и метками
INSERT INTO task_labels (task_id, label_id) VALUES
    (1, 1), -- Срочно + Исправить ошибку авторизации
    (1, 2), -- Баг + Исправить ошибку авторизации
    (2, 4), -- Документация + Обновить документацию API
    (3, 5), -- Дизайн + Редизайн главной страницы
    (4, 3), -- Улучшение + Добавить тесты для модуля оплаты
    (5, 3), -- Улучшение + Оптимизировать запросы к базе данных
    (6, 4); -- Документация + Подготовить презентацию для клиента 