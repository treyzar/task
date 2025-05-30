import React from "react";
import type { User } from "../../entities/user/user.types";
import './UserCard.scss'
interface Props {
  user: User;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  return (
    <div className="user-card">
      <h3 className="user-card__name">
        {user.first_name} {user.last_name}
      </h3>
      <p className="user-card__bio">{user.bio || "Без описания"}</p>
    </div>
  );
};
