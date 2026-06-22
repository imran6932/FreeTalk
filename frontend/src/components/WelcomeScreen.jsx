const SUGGESTIONS = [
  "Hi! Let's talk 😊",
  "Baat karte hain kuch interesting!",
  "Aaj ka din kaisa gaya?",
  "Tell me something about yourself",
  "Kya chal raha hai life mein?",
  "I want a fun conversation!",
];

export default function WelcomeScreen({ onSuggest }) {
  return (
    <div className="welcome">
      <div className="welcome-avatar">💬</div>
      <h2 className="welcome-title">Namaste! I'm FreeTalk</h2>
      <p className="welcome-sub">
        Ek dost jaise baat karo — Hindi, English, ya Hinglish. Apna naam batao aur shuru karte hain! 😄
      </p>
      <div className="suggestions">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="chip" onClick={() => onSuggest(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
