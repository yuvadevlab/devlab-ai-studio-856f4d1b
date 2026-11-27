import { createFileRoute } from "@tanstack/react-router";
import { Bot, Check, ChevronDown, LoaderCircle, RotateCcw, Send, Sparkles, UserRound } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { initialApps, initialProfiles } from "@/lib/studio-data";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Model Playground · DevLab AI Studio" },
      { name: "description", content: "Test agent profiles, prompts, and generation settings against a local demo response." },
      { property: "og:title", content: "Model Playground · DevLab AI Studio" },
      { property: "og:description", content: "Test agent profiles, prompts, and generation settings against a local demo response." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlaygroundPage,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  code?: string;
}

const initialMessages: ChatMessage[] = [
  { role: "user", content: "How should I route a model request with a safe fallback?" },
  { role: "assistant", content: "Keep the app credential scoped to the gateway, define a fallback model in the agent profile, and capture the request ID with each result. A local sample call might look like this:", code: 'const response = await gateway.chat.completions.create({\n  model: "gpt-4.1",\n  messages,\n  metadata: { app: "fin-ai" },\n});' },
];

function PlaygroundPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [profile, setProfile] = useState(initialProfiles[0]?.id ?? "support-agent");
  const [app, setApp] = useState(initialApps[0]?.slug ?? "fin-ai");
  const [systemPrompt, setSystemPrompt] = useState("You are a clear, reliable developer assistant. Be concise and include examples when useful.");
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState("2048");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastUsage, setLastUsage] = useState({ prompt: 146, completion: 112, cost: 0.0038 });
  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || busy) return;
    setMessages((items) => [...items, { role: "user", content }]);
    setDraft("");
    setBusy(true);
    window.setTimeout(() => {
      setMessages((items) => [...items, { role: "assistant", content: `In this demo, I would handle “${content}” using the ${profile} policy on ${app}. The configured system prompt, temperature (${temperature.toFixed(1)}), and token cap (${Number(maxTokens).toLocaleString()}) would shape a live response.` }]);
      setLastUsage({ prompt: 82 + content.length, completion: 96, cost: 0.0026 });
      setBusy(false);
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 650);
  };

  const resetConversation = () => {
    setMessages([]);
    setLastUsage({ prompt: 0, completion: 0, cost: 0 });
  };

  return (
    <div className="studio-page">
      <div className="studio-page-heading"><div><p className="studio-eyebrow">TESTING / MODEL SANDBOX</p><h1>Playground</h1><p>Explore profile settings in an isolated demo session.</p></div><span className="studio-local-pill"><span className="studio-live-dot studio-demo-dot" />LOCAL DEMO</span></div>
      <section className="studio-playground-layout">
        <aside className="studio-playground-config">
          <div className="studio-playground-config-head"><h2>Configuration</h2><Button variant="ghost" size="icon" className="studio-icon-button" aria-label="Reset conversation" onClick={resetConversation}><RotateCcw size={14} /></Button></div>
          <label className="studio-field studio-config-field"><span>Agent profile</span><select className="studio-select" value={profile} onChange={(event) => setProfile(event.target.value)}>{initialProfiles.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.version}</option>)}</select></label>
          <label className="studio-field studio-config-field"><span>Application</span><select className="studio-select" value={app} onChange={(event) => setApp(event.target.value)}>{initialApps.map((item) => <option key={item.id} value={item.slug}>{item.slug}</option>)}</select></label>
          <label className="studio-field studio-config-field"><span>System prompt</span><textarea className="studio-textarea" value={systemPrompt} onChange={(event) => setSystemPrompt(event.target.value)} /></label>
          <div className="studio-config-grid"><div className="studio-range-field"><div className="studio-range-head"><span>Temperature</span><strong>{temperature.toFixed(1)}</strong></div><input className="studio-range" aria-label="Temperature" type="range" min="0" max="1" step="0.1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} /></div><label className="studio-field"><span>Max tokens</span><input className="studio-input studio-input-mono" type="number" min="1" max="32768" value={maxTokens} onChange={(event) => setMaxTokens(event.target.value)} /></label></div>
          <div className="studio-config-hint"><Sparkles size={13} /><span>Responses are simulated locally. No provider is called.</span></div>
        </aside>
        <div className="studio-chat-pane">
          <div className="studio-chat-header"><strong>Conversation</strong><span className="studio-chat-model">{initialProfiles.find((item) => item.id === profile)?.model ?? "gpt-4.1"} <ChevronDown size={12} /></span></div>
          <div className="studio-chat-content" ref={chatRef} aria-live="polite">
            {messages.length === 0 && <div className="studio-chat-empty"><span><Bot size={21} /></span><strong>Start a conversation</strong><p>Try asking about gateway routing, model behavior, or agent policies.</p></div>}
            {messages.map((message, index) => <article className={`studio-chat-message${message.role === "user" ? " is-user" : ""}`} key={`${message.role}-${index}`}><div className="studio-chat-role">{message.role === "user" ? <UserRound size={12} /> : <Bot size={12} />}{message.role === "user" ? "YOU" : "DEVLAB ASSISTANT"}</div><div className="studio-chat-bubble"><p>{message.content}</p>{message.code && <pre className="studio-code-block"><code>{message.code}</code></pre>}</div></article>)}
            {busy && <article className="studio-chat-message"><div className="studio-chat-role"><Bot size={12} />DEVLAB ASSISTANT</div><div className="studio-chat-bubble studio-thinking"><span className="studio-thinking-dots"><i /><i /><i /></span><span className="studio-cursor" /></div></article>}
          </div>
          <form className="studio-chat-form" onSubmit={sendMessage}><textarea className="studio-textarea" aria-label="Message" placeholder="Message the assistant…" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} /><Button className="studio-send-icon" type="submit" size="icon" aria-label="Send message" disabled={busy || !draft.trim()}>{busy ? <LoaderCircle size={15} className="studio-spinning" /> : <Send size={15} />}</Button></form>
          <div className="studio-chat-usage"><span>Prompt <strong>{lastUsage.prompt} tokens</strong></span><span>Completion <strong>{lastUsage.completion} tokens</strong></span><span>Estimated cost <strong>${lastUsage.cost.toFixed(4)}</strong></span><span className="studio-chat-local"><Check size={11} /> Simulated</span></div>
        </div>
      </section>
    </div>
  );
}