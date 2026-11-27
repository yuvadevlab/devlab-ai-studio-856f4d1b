import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Ellipsis, ExternalLink, Plus, Server, Trash2, Pencil, ToggleLeft } from "lucide-react";
import { toast } from "sonner";

import { useStudioWorkspace } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/lib/studio-data";

export const Route = createFileRoute("/providers")({
  head: () => ({
    meta: [
      { title: "AI Providers · DevLab AI Studio" },
      { name: "description", content: "Connect and manage the model providers routed through your DevLab AI Gateway." },
      { property: "og:title", content: "AI Providers · DevLab AI Studio" },
      { property: "og:description", content: "Connect and manage the model providers routed through your DevLab AI Gateway." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProvidersPage,
});

function ProvidersPage() {
  const { providers, openProvider, updateProvider, deleteProvider } = useStudioWorkspace();
  return (
    <div className="studio-page">
      <div className="studio-page-heading">
        <div><p className="studio-eyebrow">CONTROL PLANE / CONNECTIONS</p><h1>AI Providers <span className="studio-count">{providers.length}</span></h1><p>Manage model connections and provider-level spend.</p></div>
        <div className="studio-heading-actions"><Button className="studio-button studio-button-primary" onClick={() => openProvider()}><Plus size={15} /> Add provider</Button></div>
      </div>
      <div className="studio-provider-grid">
        {providers.map((provider) => <ProviderCard key={provider.id} provider={provider} onEdit={() => openProvider(provider)} onToggle={() => updateProvider(provider.id, { active: !provider.active })} onDelete={() => { deleteProvider(provider.id); toast.success(`${provider.name} removed from this workspace`); }} />)}
      </div>
      {providers.length === 0 && <div className="studio-panel studio-empty-state"><span><Server size={19} /></span><h3>No providers connected</h3><p>Add a provider to make models available to your apps.</p><Button className="studio-button studio-button-primary" onClick={() => openProvider()}><Plus size={14} /> Add provider</Button></div>}
      <div className="studio-section-note"><span className="studio-note-spark"><Cpu size={14} /></span><span><strong>One gateway, every model.</strong> Provider credentials are demo-only in this workspace; no real keys are sent or stored.</span></div>
    </div>
  );
}

function ProviderCard({ provider, onEdit, onToggle, onDelete }: { provider: Provider; onEdit: () => void; onToggle: () => void; onDelete: () => void }) {
  return (
    <article className="studio-provider-card">
      <div className="studio-provider-top"><span className={`studio-provider-logo is-${provider.color}`}><Cpu size={18} /></span><details className="studio-provider-menu"><summary aria-label={`Actions for ${provider.name}`}><Ellipsis size={17} /></summary><div className="studio-provider-menu-content"><Button variant="ghost" className="studio-menu-action" onClick={onEdit}><Pencil size={13} /> Edit provider</Button><Button variant="ghost" className="studio-menu-action" onClick={onToggle}><ToggleLeft size={13} /> {provider.active ? "Deactivate" : "Activate"}</Button><Button variant="ghost" className="studio-menu-action studio-danger-action" onClick={onDelete}><Trash2 size={13} /> Delete</Button></div></details></div>
      <div className="studio-provider-name">{provider.name}</div><div className="studio-provider-slug">{provider.slug}</div>
      <div className="studio-provider-metrics"><div className="studio-provider-metric"><span>Models</span><strong>{provider.models}</strong></div><div className="studio-provider-metric"><span>Spend this month</span><strong>${provider.spend.toFixed(2)}</strong></div></div>
      <div className="studio-provider-bottom"><span className={`studio-status ${provider.active ? "studio-status-active" : "studio-status-inactive"}`}>{provider.active ? "Active" : "Inactive"}</span><Button variant="ghost" className="studio-link-button" onClick={() => toast(`${provider.name} models`, { description: `${provider.models} models are configured for this provider.` })}>Manage models <ExternalLink size={12} /></Button></div>
    </article>
  );
}