import { useState, useEffect } from "react";

export default function ModelSelector({
  model,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/models")
      .then((res) => res.json())
      .then((data) =>
        setModels(data.models || [])
      )
      .catch(console.error);
  }, []);

  const current =
    models.find((m) => m.id === model) ||
    models[0];

  if (!current) return null;

  return (
    <div
      className="model-selector"
      onBlur={() =>
        setTimeout(() => setOpen(false), 150)
      }
    >
      <button
        type="button"
        className="model-btn"
        onClick={() => setOpen(!open)}
      >
        <span>🧠</span>
        <span>{current.name}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="model-dropdown">
          {models.map((m) => (
            <button
              key={m.id}
              className={`model-option ${
                m.id === model
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                onChange(m.id);
                setOpen(false);
              }}
            >
              <span>{m.name}</span>
              <span>{m.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}