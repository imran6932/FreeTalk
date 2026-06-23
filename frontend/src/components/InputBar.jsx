import { useState, useRef, useEffect } from "react";

export default function InputBar({
  onSend,
  onStop,
  streaming,
}) {
  const [text, setText] =
    useState("");
  const [interim, setInterim] =
    useState("");

  const ref = useRef(null);
  const recognitionRef =
    useRef(null);

  useEffect(() => {
    if (!streaming) {
      setTimeout(() => {
        ref.current?.focus();
      }, 50);
    }
  }, [streaming]);

  const send = () => {
    if (
      !text.trim() ||
      streaming
    )
      return;

    onSend(text);

    setText("");
    setInterim("");

    ref.current?.focus();
  };

  const keyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      send();
    }
  };

  return (
    <footer className="input-bar">
      <div className="input-wrap">
        <textarea
          ref={ref}
          className="input-field"
          placeholder="Type your message..."
          value={text + interim}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          onKeyDown={keyDown}
          rows={1}
          disabled={streaming}
        />

        {streaming ? (
          <button
            className="send-btn stop-btn"
            onClick={onStop}
          >
            ⏹
          </button>
        ) : (
          <button
            className="send-btn"
            onClick={send}
            disabled={
              !text.trim()
            }
          >
            ➤
          </button>
        )}
      </div>

      <div className="input-footer">
        <p className="input-note">
          Powered by Ollama ·
          Fully local · Private
        </p>
      </div>
    </footer>
  );
}