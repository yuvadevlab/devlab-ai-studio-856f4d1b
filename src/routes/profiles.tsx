import { createFileRoute } from "@tanstack/react-router";
import { Bot, Check, Plus, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { initialProfiles, type AgentProfile } from "@/lib/studio-data";

export const Route = createFileRoute("/profiles")({
  head: () => ({
    meta: [
      { title: "Agent Profiles · DevLab AI Studio" },
      { name: "description", content: "Tune model policy, response limits, and agent capabilities for each profile." },
      { property: "og:title", content: "Agent Profiles · DevLab AI Studio" },
      { property: "og:description", content: "Tune model policy, response limits, and agent capabilities for each profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilesPage,
});

const featureNames = ["Agent mode", "Show reasoning", "Live console", "Parallel tool calls", "Follow-up suggestions"];
const defaultFeatures: Record<string, boolean> = { "Agent mode": true, "Show reasoning": false, "Live console": true, "Parallel tool calls": true, "Follow-up suggestions": false };

function ProfilesPage() {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [selectedId, setSelectedId] = useState(initialProfiles[0]?.id ?? "");
  const selected = profiles.find((profile) => profile.id === selectedId) ?? profiles[0];
  const [model, setModel] = useState(selected?.model ?? "gpt-4.1");
  const [preset, setPreset] = useState<AgentProfile["preset"]>(selected?.preset ?? "Balanced");
  const [maxTurns, setMaxTurns] = useState(selected?.maxTurns ?? 12);
  const [maxTokens, setMaxTokens] = useState(selected?.maxTokens ?? 8192);
  const [features, setFeatures] = useState(defaultFeatures);
  const [fallbacks, setFallbacks] = useState(["gpt-4.1-mini", "gemini-2.5-flash"]);
  const [fallbackInput, setFallbackInput] = useState("");

  useEffect(() => {
    if (!selected) return;
    setModel(selected.model);
    setPreset(selected.preset);
    setMaxTurns(selected.maxTurns);
    setMaxTokens(selected.maxTokens);
    setFeatures(defaultFeatures);
  }, [selectedId]);

  const save = () => {
    if (!selected) return;
    setProfiles((items) => items.map((item) => item.id === selected.id ? { ...item, model, preset, maxTurns, maxTokens } : item));
    toast.success("Profile policy saved", { description: `${selected.name} is updated in this demo workspace.` });
  };
  const discard = () => {
    if (!selected) return;
    setModel(selected.model);
    setPreset(selected.preset);
    setMaxTurns(selected.maxTurns);
    setMaxTokens(selected.maxTokens);
    setFeatures(defaultFeatures);
    setFallbacks(["gpt-4.1-mini", "gemini-2.5-flash"]);
    toast("Changes discarded");
  };
  const addFallback = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = fallbackInput.trim();
    if (value && !fallbacks.includes(value)) setFallbacks((items) => [...items, value]);
    setFallbackInput("");
  };
  const createProfile = () => {
    const created: AgentProfile = { id: `profile-${Date.now()}`, name: "New agent profile", version: "v1.0", model: "gpt-4.1", preset: "Balanced", maxTurns: 10, maxTokens: 4096 };
    setProfiles((items) => [...items, created]);
    setSelectedId(created.id);
    toast.success("Profile created");
  };

  return (
    <div className="studio-page">
      <div className="studio-page-heading"><div><p className="studio-eyebrow">CONTROL PLANE / POLICY</p><h1>Agent profiles</h1><p>Versioned policies for model behavior and agent capabilities.</p></div><Button className="studio-button studio-button-primary" onClick={createProfile}><Plus size={15} /> New profile</Button></div>
      <div className="studio-profile-layout">
        <section className="studio-panel"><div className="studio-panel-heading"><div><h2>Profiles</h2><p>{profiles.length} configured</p></div><span className="studio-kpi-icon"><Bot size={14} /></span></div><div className="studio-profile-list">{profiles.map((profile) => <Button variant="ghost" key={profile.id} className={`studio-profile-item${profile.id === selectedId ? " is-selected" : ""}`} onClick={() => setSelectedId(profile.id)}><span className="studio-profile-symbol"><Bot size={15} /></span><span className="studio-profile-item-copy"><strong>{profile.name}</strong><small>{profile.version} · {profile.model}</small></span></Button>)}</div></section>
        {selected ? <section className="studio-panel studio-profile-edit"><div className="studio-profile-edit-head"><div><h2>{selected.name}</h2><p>PROFILE ID <span className="studio-accent-text">{selected.id}</span> · {selected.version}</p></div><span className="studio-preset-badge">{preset}</span></div>
          <div className="studio-profile-grid">
            <label className="studio-field"><span>Linked model</span><select className="studio-select" value={model} onChange={(event) => setModel(event.target.value)}><option>claude-3-7-sonnet</option><option>gpt-4.1</option><option>gpt-4.1-mini</option><option>gemini-2.5-pro</option><option>gemini-2.5-flash</option><option>mistral-large</option></select></label>
            <div className="studio-field"><span>Creativity preset</span><div className="studio-preset-group">{(["Analytical", "Balanced", "Creative"] as const).map((choice) => <Button key={choice} variant="ghost" className={`studio-preset-button${preset === choice ? " is-selected" : ""}`} onClick={() => setPreset(choice)}>{choice}</Button>)}</div></div>
            <div className="studio-range-field"><div className="studio-range-head"><span>Maximum turns</span><strong>{maxTurns}</strong></div><input className="studio-range" aria-label="Maximum turns" type="range" min="1" max="50" value={maxTurns} onChange={(event) => setMaxTurns(Number(event.target.value))} /><div className="studio-range-caption"><span>1 turn</span><span>50 turns</span></div></div>
            <div className="studio-range-field"><div className="studio-range-head"><span>Maximum tokens</span><strong>{maxTokens.toLocaleString()}</strong></div><input className="studio-range" aria-label="Maximum tokens" type="range" min="256" max="32768" step="256" value={maxTokens} onChange={(event) => setMaxTokens(Number(event.target.value))} /><div className="studio-range-caption"><span>256</span><span>32,768</span></div></div>
          </div>
          <div className="studio-profile-section-title"><SlidersHorizontal size={13} /><span>FEATURE FLAGS</span></div>
          <div className="studio-feature-list">{featureNames.map((name) => <label className="studio-feature-row" key={name}><span>{name}</span><input aria-label={name} className="studio-switch" type="checkbox" checked={features[name] ?? false} onChange={(event) => setFeatures((state) => ({ ...state, [name]: event.target.checked }))} /></label>)}</div>
          <div className="studio-fallback-block"><div className="studio-range-head"><span>Fallback model IDs</span><span className="studio-muted-label">IN ROUTING ORDER</span></div><div className="studio-tag-row">{fallbacks.map((fallback) => <span className="studio-tag" key={fallback}>{fallback}<Button variant="ghost" size="icon" className="studio-tag-remove" aria-label={`Remove ${fallback}`} onClick={() => setFallbacks((items) => items.filter((item) => item !== fallback))}><X size={11} /></Button></span>)}<input className="studio-tag-add" aria-label="Add fallback model" placeholder="+ Add model" value={fallbackInput} onChange={(event) => setFallbackInput(event.target.value)} onKeyDown={addFallback} /></div></div>
          <div className="studio-profile-actions"><Button variant="outline" className="studio-button" onClick={discard}><RotateCcw size={13} /> Discard</Button><Button className="studio-button studio-button-primary" onClick={save}><Check size={14} /> Save policy</Button></div>
        </section> : <div className="studio-panel studio-empty-state"><span><Bot size={19} /></span><h3>No profile selected</h3><p>Create a profile to define agent behavior.</p></div>}
      </div>
    </div>
  );
}