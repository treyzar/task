import React from "react";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { updateLabel } from "../../entities/label/label.api";
import "./EditLabelForm.scss";

interface Props {
  labelId: number;
  caption: string;
  color: string;
  onUpdated: () => void;
}

export const EditLabelForm: React.FC<Props> = ({
  labelId,
  caption,
  color,
  onUpdated,
}) => {
  const [captionInput, setCaption] = React.useState(caption);
  const [colorInput, setColor] = React.useState(color);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateLabel(labelId, captionInput, colorInput);

    onUpdated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Название метки</label>
        <Input
          type="text"
          value={captionInput}
          onChange={(e) => setCaption(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Цвет метки</label>
        <div className="color-picker-wrapper">
          <Input
            type="text"
            value={colorInput}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#FF0000"
            required
            className="color-input"
          />
          <input
            type="color"
            value={colorInput}
            onChange={(e) => setColor(e.target.value)}
            className="color-wheel"
          />
        </div>
      </div>

      <Button>Сохранить</Button>
    </form>
  );
};
