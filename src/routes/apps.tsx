import { createFileRoute } from "@tanstack/react-router";
import { AppWindow, Copy, Ellipsis, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useStudioWorkspace } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import type { StudioApp } from "@/lib/studio-data";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "Registered Apps · DevLab AI Studio" },
      { name: "description", content: "Manage application endpoints, access status, and monthly AI budgets." },
      { property: "og:title", content: "Registered Apps · DevLab AI Studio" },
      { property: "og:description", content: "Manage application endpoints, access status, and monthly AI budgets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppsPage,
});

function AppsPage() {
  const { apps, openApp, deleteApp } = useStudioWorkspace();
  const copyApiKey = async (app: StudioApp) => {
    try {
      await navigator.clipboard.writeText(`dl_demo_${app.slug}_key`);
      toast.success("Demo API key copied", { description: "This sample key is not connected to a live service." });
    } catch {
      toast.error("Clipboard unavailable", { description: `Demo key: dl_demo_${app.slug}_key` });
    }
  };

  return (
    <div className="studio-page">
      <div className="studio-page-heading">
        <div><p className="studio-eyebrow">CONTROL PLANE / CLIENTS</p><h1>Registered apps <span className="studio-count">{apps.length}</span></h1><p>Manage application credentials, MCP endpoints, and spend limits.</p></div>
        <div className="studio-heading-actions"><Button className="studio-button studio-button-primary" onClick={() => openApp()}><Plus size={15} /> Register app</Button></div>
      </div>
      <section className="studio-panel">
        <div className="studio-panel-heading"><div><h2>Workspace apps</h2><p>Access and budget controls for your registered clients</p></div><label className="studio-search"><Search size={14} /><input aria-label="Search apps" placeholder="Search apps" onChange={(event) => { const query = event.target.value.toLowerCase(); document.querySelectorAll<HTMLTableRowElement>("[data-app-row]").forEach((row) => { row.hidden = !row.innerText.toLowerCase().includes(query); }); }} /></label></div>
        <div className="studio-app-table-wrap"><table className="studio-table studio-app-table"><thead><tr><th>APP NAME</th><th>SLUG</th><th>MCP ENDPOINT</th><th>MONTHLY BUDGET</th><th>STATUS</th><th>CREATED</th><th>ACTIONS</th></tr></thead><tbody>
          {apps.map((app) => <tr data-app-row key={app.id}><td><span className="studio-app-name-cell"><span className="studio-app-glyph"><AppWindow size={13} /></span>{app.name}</span></td><td><span className="studio-mono">{app.slug}</span></td><td><span className="studio-endpoint" title={app.endpoint || "No endpoint configured"}>{app.endpoint || "—"}</span></td><td><span className="studio-budget-cell">${app.budget.toLocaleString()} <span className="studio-muted-label">/ mo</span></span></td><td><span className={`studio-status ${app.active ? "studio-status-active" : "studio-status-inactive"}`}>{app.active ? "Active" : "Inactive"}</span></td><td>{app.created}</td><td><div className="studio-action-group"><Button variant="ghost" size="icon" className="studio-icon-button" aria-label={`Edit ${app.name}`} onClick={() => openApp(app)}><Pencil size={14} /></Button><Button variant="ghost" size="icon" className="studio-icon-button" aria-label={`Copy ${app.name} API key`} onClick={() => void copyApiKey(app)}><Copy size={14} /></Button><details className="studio-provider-menu"><summary aria-label={`More actions for ${app.name}`}><Ellipsis size={16} /></summary><div className="studio-provider-menu-content"><Button variant="ghost" className="studio-menu-action studio-danger-action" onClick={() => { deleteApp(app.id); toast.success(`${app.name} removed`); }}><Trash2 size={13} /> Delete app</Button></div></details></div></td></tr>)}
        </tbody></table></div>
        {apps.length === 0 && <div className="studio-empty-state"><span><AppWindow size={19} /></span><h3>No apps registered</h3><p>Register an app to start managing access and budgets.</p><Button className="studio-button studio-button-primary" onClick={() => openApp()}><Plus size={14} /> Register app</Button></div>}
      </section>
    </div>
  );
}