import React from "react";
import { getUsers } from "../../entities/user/user.api";
import type { User } from "../../entities/user/user.types";
import { UserCard } from "./UserCard";
import './UsersPage.scss'
export const UsersPage: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterRole, setFilterRole] = React.useState<string>("");

  React.useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const roles = React.useMemo(() => {
    const uniqueRoles = new Set<string>();
    users.forEach((user) => {
      if (user.bio) {
        const role = user.bio.split(" ").slice(0, 2).join(" ");
        uniqueRoles.add(role);
      }
    });
    return ["Все", ...Array.from(uniqueRoles)];
  }, [users]);

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        filterRole === "Все" || (user.bio && user.bio.includes(filterRole));

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="users-page">
      <h2>Пользователи</h2>

      <div className="filters">
        <div className="search-input">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder="Поиск по имени или фамилии"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="users-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <p>Нет пользователей по заданным критериям</p>
        )}
      </div>
    </div>
  );
};


