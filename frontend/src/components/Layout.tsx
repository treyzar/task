import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./Layout.module.scss";

export default function Layout() {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link
              to="/users"
              className={`${styles.navLink} ${
                location.pathname === "/users" ? styles.active : ""
              }`}
            >
              Пользователи
            </Link>
            <Link
              to="/tags"
              className={`${styles.navLink} ${
                location.pathname === "/tags" ? styles.active : ""
              }`}
            >
              Метки
            </Link>
            <Link
              to="/tasks"
              className={`${styles.navLink} ${
                location.pathname === "/tasks" ? styles.active : ""
              }`}
            >
              Задачи
            </Link>
          </nav>
        </div>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
