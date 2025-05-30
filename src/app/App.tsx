import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './app.scss'
export const App: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/tasks">Задачи</Link></li>
          <li><Link to="/users">Пользователи</Link></li>
          <li><Link to='/labels'>Метки</Link></li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};