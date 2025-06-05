#!/bin/sh
set -e

# Установка клиентских утилит
apk add --no-cache curl postgresql-client

# Ждем Postgres
echo "⏳ Waiting for PostgreSQL to be ready..."
until PGPASSWORD=postgrespassword psql -h postgres -U postgres -d tasks_db -c '\q'; do
  echo "🔴 PostgreSQL is unavailable - sleeping"
  sleep 5
done

# Применяем миграции
echo "📦 Applying database migrations..."
PGPASSWORD=postgrespassword psql -h postgres -U postgres -d tasks_db -f /migrations/1_create_tables.sql
PGPASSWORD=postgrespassword psql -h postgres -U postgres -d tasks_db -f /migrations/2_sample_data.sql

# Проверяем структуру таблиц
echo "🔍 Checking database structure..."
PGPASSWORD=postgrespassword psql -h postgres -U postgres -d tasks_db -c "\d+ tasks"
PGPASSWORD=postgrespassword psql -h postgres -U postgres -d tasks_db -c "\d+ users"

# Ждем Hasura
echo "⏳ Waiting for Hasura GraphQL Engine to be ready..."
until curl -s -X POST http://graphql-engine:8080/v1/graphql -H "X-Hasura-Admin-Secret: mysupersecretkey" --data '{"query":"query ping { __typename }"}' | grep -q '__typename'; do
  echo "🔴 Hasura is not ready yet - sleeping"
  sleep 5
done

# Очищаем существующие метаданные
echo "🧹 Clearing existing metadata..."
curl -s -X POST http://graphql-engine:8080/v1/metadata \
  -H "Content-Type: application/json" \
  -H "X-Hasura-Admin-Secret: mysupersecretkey" \
  -d '{"type": "clear_metadata", "args": {}}'

sleep 5

# Функция для применения метаданных
apply_metadata() {
  local payload="$1"
  local name="$2"

  echo "🔧 Applying metadata: $name"
  response=$(echo "$payload" | curl -s -X POST http://graphql-engine:8080/v1/metadata \
    -H "Content-Type: application/json" \
    -H "X-Hasura-Admin-Secret: mysupersecretkey" \
    -d @-)
  echo "$response"
  
  # Добавляем паузу между запросами
  sleep 2
}

# Создаем источник данных
echo "🔄 Creating database source..."
apply_metadata '{
  "type": "pg_add_source",
  "args": {
    "name": "default",
    "configuration": {
      "connection_info": {
        "database_url": "postgres://postgres:postgrespassword@postgres:5432/tasks_db",
        "isolation_level": "read-committed",
        "use_prepared_statements": false
      }
    }
  }
}' "Add database source"

sleep 5

# Трекинг таблиц
echo "🔄 Tracking tables in Hasura..."
apply_metadata '{"type":"pg_track_table","args":{"table":{"schema":"public","name":"users"},"source":"default"}}' "Track users"
apply_metadata '{"type":"pg_track_table","args":{"table":{"schema":"public","name":"labels"},"source":"default"}}' "Track labels"
apply_metadata '{"type":"pg_track_table","args":{"table":{"schema":"public","name":"tasks"},"source":"default"}}' "Track tasks"
apply_metadata '{"type":"pg_track_table","args":{"table":{"schema":"public","name":"task_labels"},"source":"default"}}' "Track task_labels"

sleep 5

# Отношения
echo "🔗 Setting up relationships..."

# User.tasks (array)
apply_metadata '{"type":"pg_create_array_relationship","args":{"table":{"schema":"public","name":"users"},"name":"tasks","using":{"foreign_key_constraint_on":{"table":{"schema":"public","name":"tasks"},"column":"assignee_id"}},"source":"default"}}' "User.tasks array"

# Task.assignee (object)
apply_metadata '{"type":"pg_create_object_relationship","args":{"table":{"schema":"public","name":"tasks"},"name":"assignee","using":{"foreign_key_constraint_on":"assignee_id"},"source":"default"}}' "Task.assignee object"

# Task.task_labels (array)
apply_metadata '{"type":"pg_create_array_relationship","args":{"table":{"schema":"public","name":"tasks"},"name":"task_labels","using":{"foreign_key_constraint_on":{"table":{"schema":"public","name":"task_labels"},"column":"task_id"}},"source":"default"}}' "Task.task_labels array"

# Label.task_labels (array)
apply_metadata '{"type":"pg_create_array_relationship","args":{"table":{"schema":"public","name":"labels"},"name":"task_labels","using":{"foreign_key_constraint_on":{"table":{"schema":"public","name":"task_labels"},"column":"label_id"}},"source":"default"}}' "Label.task_labels array"

# TaskLabels.task (object)
apply_metadata '{"type":"pg_create_object_relationship","args":{"table":{"schema":"public","name":"task_labels"},"name":"task","using":{"foreign_key_constraint_on":"task_id"},"source":"default"}}' "TaskLabels.task object"

# TaskLabels.label (object)
apply_metadata '{"type":"pg_create_object_relationship","args":{"table":{"schema":"public","name":"task_labels"},"name":"label","using":{"foreign_key_constraint_on":"label_id"},"source":"default"}}' "TaskLabels.label object"

# Проверяем статус метаданных
echo "🔍 Checking metadata status..."
curl -s -X GET http://graphql-engine:8080/v1/metadata \
  -H "Content-Type: application/json" \
  -H "X-Hasura-Admin-Secret: mysupersecretkey"

echo "✅ Initialization completed successfully!"