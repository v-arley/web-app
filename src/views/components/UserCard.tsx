import { Activity } from "lucide-react";
import { LineDotRightHorizontal } from "lucide-react";
import { IdCard } from "lucide-react";
import { UserRoundX } from "lucide-react";
import "./UserCard.css";

type UserCardProps = {
  name: string;
  lastName: string;
  role: string;
  id: string;
  active: boolean;
  profession: string;
  imageUrl: string;
};

export function UserCard({
  name,
  lastName,
  role,
  id,
  active,
  profession,
  imageUrl,
}: UserCardProps) {
  return (
    <div className="user-card">
      <div className="user-card-image-wrapper">
        <div className="user-card-status">
          {active ? (
            <Activity className="user-card-status-icon active-icon" />
          ) : (
            <LineDotRightHorizontal className="user-card-status-icon inactive-icon" />
          )}
          <p className={active ? "status-text-active" : "status-text-inactive"}>
            {active ? "Activo" : "Inactivo"}
          </p>
        </div>
        <img
          src={imageUrl}
          alt={name}
          className={`user-card-image ${active ? "" : "user-card-image-inactive"}`}
        />
        <div className="user-card-overlay" />
      </div>
      <div className="user-card-content">
        <div>
          <h2 className={active ? "" : "user-card-name-inactive"}>{name}</h2>
          <h2 className={active ? "" : "user-card-name-inactive"}>{lastName}</h2>
        </div>
        <div className="user-card-role-block">
          <p className={active ? "user-card-profession-active" : "user-card-profession-inactive"}>
            {profession}
          </p>
          <p className="user-card-role">{role}</p>
        </div>
        <div className="user-card-id-row">
          <div>
            <p className="user-card-id-label">Cédula</p>
            <p className="user-card-id-value">{id}</p>
          </div>
          <div>
            {active ? (
              <IdCard
                strokeWidth={1.25}
                className="user-card-id-icon-active"
              />
            ) : (
              <UserRoundX className="user-card-id-icon-inactive" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}