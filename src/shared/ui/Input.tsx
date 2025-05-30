import React from 'react';
import '../styles/Input.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<Props> = (props) => {
  return <input className="input" {...props} />;
};