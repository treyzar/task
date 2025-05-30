import React from 'react';
import '../styles/Button.scss';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
}

export const Button: React.FC<Props> = ({ children, onClick, secondary }) => {
  return (
    <button
      className={`button ${secondary ? 'button--secondary' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};