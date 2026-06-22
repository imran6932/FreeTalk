import { useState, useRef, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import "./App.css";
import { streamChat, fetchHistory, fetchModels } from "./utils/api";

function getDeviceName() {
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown Device";
}

function createUserId() {
  return "user_" + Math.random().toString(36).slice(2, 11);
}

function getUserId() {
  let id = localStorage.getItem("freetalk_user_id");
  if (!id) {
    id = createUserId();
    localStorage.setItem("freetalk_user_id", id);
  }
  return id;
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("llama3.1:8b");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(getUserId);
  const deviceName = getDeviceName();
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("freetalk_profile");
    return stored ? JSON.parse(stored) : null;
  });

  const abortRef = useRef(null);

  // Fetch models from API on mount
  useEffect(() => {
    fetchModels()
      .then((list) => {
        setModels(list);
        if (list.length > 0) setModel(list[0].id);
      })
      .catch(console.error);
  }, []);

  // Load history for current userId
  useEffect(() => {
    setLoading(true);
    fetchHistory(userId)
      .then((history) => setMessages(history))
      .catch((e) => console.error("History fetch failed:", e))
      .finally(() => setLoading(false));
  }, [userId]);

  const sendMessage = async (text) => {
    const message = text?.trim();
    if (!message || streaming) return;

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      let botReply = "";
      await streamChat(
        userId,
        message,
        model,
        deviceName,
        // onDelta
        (delta) => {
          botReply += delta;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: botReply,
            };
            return updated;
          });
        },
        // onMeta
        (meta) => {
          if (!meta?.gender) return;
          setProfile((current) => {
            if (current) return current;
            const botName =
              meta.gender === "male" ? "Priya"
              : meta.gender === "female" ? "Imran"
              : "FreeTalk";
            const profileData = { gender: meta.gender, bot_name: botName };
            localStorage.setItem("freetalk_profile", JSON.stringify(profileData));
            return profileData;
          });
        },
        ctrl.signal
      );

    } catch (e) {
      if (e.name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Oops! Kuch problem aa gayi. Thoda baad try karo 🥺",
            isError: true,
          };
          return updated;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const handleClear = () => {
    localStorage.removeItem("freetalk_user_id");
    localStorage.removeItem("freetalk_profile");
    const newId = createUserId();
    localStorage.setItem("freetalk_user_id", newId);
    setUserId(newId);
    setMessages([]);
    setProfile(null);
  };

  const displayName = profile?.bot_name || "FreeTalk";

  return (
    <div className="app">
      <Header
        model={model}
        onModelChange={setModel}
        onClear={handleClear}
        hasMessages={messages.length > 0}
        userId={userId}
        username={displayName}
        models={models}
      />
      <main className="main">
        {loading ? (
          <div className="loading-screen">
            <div className="loader" />
            <p>Pehle ki baatein load ho rahi hain...</p>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSuggest={sendMessage} />
        ) : (
          <ChatWindow messages={messages} streaming={streaming} />
        )}
      </main>
      <InputBar onSend={sendMessage} onStop={stopStreaming} streaming={streaming} />
    </div>
  );
}
