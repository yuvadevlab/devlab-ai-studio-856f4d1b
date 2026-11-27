import { createFileRoute } from "@tanstack/react-router";
import { Activity, ArrowDownRight, ArrowUpRight, Boxes, CircleDollarSign, Clock3, Cpu, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { recentRuns, topModels, type RunStatus } from "@/lib/studio-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · DevLab AI Studio" },
      { name: "description", content: "Monitor model traffic, spend, apps, and latency across the DevLab AI Gateway." },
      { property: "og:title", content: "Overview · DevLab AI Studio" },
      { property: "og:description", content: "Monitor model traffic, spend, apps, and latency across the DevLab AI Gateway." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <div className="studio-page">
      <div className="studio-page-heading">
        <div><p className="studio-eyebrow">CONTROL PLANE / OVERVIEW</p><h1>Gateway overview</h1><p>Your AI traffic at a glance. Last updated just now.</p></div>
        <div className="studio-heading-actions"><span className="studio-status studio-status-success">All systems operational</span></div>
      </div>

      <section className="studio-kpi-grid" aria-label="Gateway metrics">
        <article className="studio-kpi-card">
          <div className="studio-kpi-label"><span>Total requests <span className="studio-muted-label">· 24h</span></span><span className="studio-kpi-icon"><Activity size={14} /></span></div>
          <div className="studio-kpi-value">48,291</div>
          <div className="studio-kpi-foot"><span className="studio-kpi-delta">+12.8%</span><ArrowUpRight size={12} className="studio-positive-icon" /><span>vs. previous 24h</span></div>
        </article>
        <article className="studio-kpi-card">
          <div className="studio-kpi-label"><span>Total cost <span className="studio-muted-label">· 24h</span></span><span className="studio-kpi-icon"><CircleDollarSign size={14} /></span></div>
          <div className="studio-kpi-value">$142.86</div>
          <div className="studio-kpi-foot"><span className="studio-kpi-delta">−4.2%</span><ArrowDownRight size={12} className="studio-positive-icon" /><span>vs. previous 24h</span><svg className="studio-kpi-chart" viewBox="0 0 74 25" aria-hidden="true"><polyline points="1,20 10,17 17,19 24,11 31,14 39,6 47,10 55,4 64,8 73,2" /></svg></div>
        </article>
        <article className="studio-kpi-card">
          <div className="studio-kpi-label"><span>Active apps</span><span className="studio-kpi-icon"><Boxes size={14} /></span></div>
          <div className="studio-kpi-value">4 <small>/ 4 registered</small></div>
          <div className="studio-kpi-foot"><span className="studio-kpi-delta">+1</span><span>connected this month</span></div>
        </article>
        <article className="studio-kpi-card">
          <div className="studio-kpi-label"><span>Avg. latency</span><span className="studio-kpi-icon"><Clock3 size={14} /></span></div>
          <div className="studio-kpi-value">684 <small>ms</small></div>
          <div className="studio-kpi-foot"><span className="studio-status studio-status-success">Healthy</span><span>p95 1,842 ms</span></div>
        </article>
      </section>

      <section className="studio-overview-grid">
        <article className="studio-panel">
          <div className="studio-panel-heading"><div><h2>Recent runs</h2><p>Latest gateway requests across all apps</p></div><Button variant="ghost" className="studio-small-link" onClick={() => window.location.assign("/telemetry")}>View telemetry <ArrowUpRight size={13} /></Button></div>
          <div className="studio-run-table-wrap"><table className="studio-table"><thead><tr><th>APP</th><th>MODEL</th><th>TOKENS</th><th>COST</th><th>STATUS</th><th>TIME AGO</th></tr></thead><tbody>
            {recentRuns.map((run, index) => <tr key={`${run.app}-${run.model}-${index}`}><td><span className="studio-app-cell">{run.app}</span></td><td><span className="studio-mono">{run.model}</span></td><td>{run.tokens.toLocaleString()}</td><td><span className="studio-mono">${run.cost.toFixed(4)}</span></td><td><RunBadge status={run.status} /></td><td>{run.time}</td></tr>)}
          </tbody></table></div>
        </article>

        <article className="studio-panel">
          <div className="studio-panel-heading"><div><h2>Top models by cost</h2><p>Spend this month · USD</p></div><span className="studio-kpi-icon"><Cpu size={14} /></span></div>
          <div className="studio-model-list">{topModels.map((model) => <div className="studio-model-item" key={model.name}><div><div className="studio-model-name">{model.name}</div><div className="studio-model-provider">{model.provider}</div></div><div><div className="studio-model-cost">${model.cost.toFixed(2)}</div><div className="studio-model-requests">{model.requests} req</div></div><div className="studio-model-track"><span style={{ width: `${model.share}%` }} /></div></div>)}</div>
          <div className="studio-panel-footnote"><Workflow size={13} /><span>Traffic routed across 4 providers</span></div>
        </article>
      </section>
    </div>
  );
}

function RunBadge({ status }: { status: RunStatus }) {
  const label = status === "success" ? "Success" : status === "streaming" ? "Streaming" : "Error";
  return <span className={`studio-status studio-status-${status}`}>{label}</span>;
}