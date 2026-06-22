const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchHistory(userId) {
  const res = await fetch(`${API_BASE}/history/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  const data = await res.json();
  return data.messages || [];
}

export async function fetchModels() {
  const res = await fetch(`${API_BASE}/models`);
  if (!res.ok) throw new Error("Failed to fetch models");
  const data = await res.json();
  return data.models || [];
}

// Delete API kept — but clear button does NOT call this
export async function clearHistory(userId) {
  await fetch(`${API_BASE}/history/${userId}`, { method: "DELETE" });
}

export async function streamChat(userId, message, model, deviceName, onDelta, onMeta, signal) {
  const res = await fetch(`${API_BASE}/chat/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, model, stream: true, device_name: deviceName }),
    signal,
  });

  if (!res.ok) throw new Error(await res.text());

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (raw === "[DONE]") return;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.delta) onDelta(parsed.delta);
        if (parsed.done && parsed.gender) onMeta(parsed);
        if (parsed.error) throw new Error(parsed.error);
      } catch {}
    }
  }
}
