import React from "react";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { createLabel } from "../../entities/label/label.api";
import "./CreateLabelForm.scss";

interface Props {
  onCreate: () => void;
}

export const CreateLabelForm: React.FC<Props> = ({ onCreate }) => {
  const [caption, setCaption] = React.useState("");
  const [color, setColor] = React.useState("#FF0000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLabel(caption, color);
    onCreate();
    setCaption("");
    setColor("#FF0000");
  };

  return (
    <form onSubmit={handleSubmit} className="create-label-form">
      <div className="form-group">
        <label className="form-label">Название метки</label>
        <Input
          placeholder="Введите название"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Цвет метки</label>
        <div className="color-picker-wrapper">
          <Input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#FF0000"
            required
            className="color-input"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-wheel"
          />
        </div>
      </div>

      <Button>Добавить метку</Button>
    </form>
  );
};
