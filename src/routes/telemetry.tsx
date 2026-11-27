import { createFileRoute } from "@tanstack/react-router";
import { Activity, Download, Pause, Play, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { initialApps, initialTelemetry, type RunStatus, type TelemetryEvent } from "@/lib/studio-data";

export const Route = createFileRoute("/telemetry")({
  head: () => ({
    meta: [
      { title: "Live Telemetry · DevLab AI Studio" },
      { name: "description", content: "Inspect request events, model latency, and gateway health across connected apps." },
      { property: "og:title", content: "Live Telemetry · DevLab AI Studio" },
      { property: "og:description", content: "Inspect request events, model latency, and gateway health across connected apps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TelemetryPage,
});

function TelemetryPage() {
  const [events, setEvents] = useState(initialTelemetry);
  const [appFilter, setAppFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);
  const visibleEvents = useMemo(() => events.filter((event) => (appFilter === "all" || event.app === appFilter) && (statusFilter === "all" || event.status === statusFilter)), [events, appFilter, statusFilter]);

  useEffect(() => {
    if (autoScroll && logRef.current) logRef.current.scrollTop = 0;
  }, [autoScroll, visibleEvents.length]);

  const exportCsv = () => {
    const rows = [["timestamp", "app", "model", "tokens", "latency_ms", "status", "level", "message"], ...visibleEvents.map((event) => [event.timestamp, event.app, event.model, String(event.tokens), String(event.latency), event.status, event.level, event.message])];
    const csv = rows.map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "devlab-telemetry.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Telemetry exported", { description: `${visibleEvents.length} rows saved as CSV.` });
  };

  const clearEvents = () => {
    setEvents([]);
    toast("Stream cleared", { description: "Sample events are cleared for this session." });
  };

  return (
    <div className="studio-page">
      <div className="studio-page-heading"><div><p className="studio-eyebrow">OBSERVABILITY / REQUEST STREAM</p><h1>Live telemetry</h1><p>Request-level events from your AI gateway.</p></div><span className="studio-status studio-status-streaming">LIVE STREAM</span></div>
      <section className="studio-terminal">
        <div className="studio-telemetry-toolbar"><div className="studio-filter-group"><select className="studio-select studio-filter-select" aria-label="Filter by app" value={appFilter} onChange={(event) => setAppFilter(event.target.value)}><option value="all">All apps</option>{initialApps.map((app) => <option value={app.slug} key={app.id}>{app.slug}</option>)}</select><select className="studio-select studio-filter-select" aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="success">Success</option><option value="streaming">Streaming</option><option value="error">Error</option></select><select className="studio-select studio-filter-select" aria-label="Date range" defaultValue="24h"><option value="1h">Last hour</option><option value="24h">Last 24 hours</option><option value="7d">Last 7 days</option></select></div><div className="studio-telemetry-actions"><Button variant="ghost" className="studio-toolbar-button" onClick={clearEvents}><Trash2 size={13} /> Clear</Button><Button variant="ghost" className="studio-toolbar-button" onClick={exportCsv}><Download size={13} /> Export CSV</Button></div></div>
        <div className="studio-log-window" ref={logRef} role="log" aria-label="Gateway event stream" aria-live="polite">{visibleEvents.map((event: TelemetryEvent, index) => <LogRow event={event} key={`${event.timestamp}-${index}`} />)}{visibleEvents.length === 0 && <div className="studio-empty-state"><span><Activity size={18} /></span><h3>No events in this view</h3><p>Adjust your filters or wait for new traffic to appear.</p></div>}</div>
        <div className="studio-log-tail"><span className="studio-live-dot" /><span>{visibleEvents.length} events</span><span className="studio-tail-spacer" />{autoScroll ? "Auto-scroll on" : "Auto-scroll paused"}<Button variant="ghost" size="icon" className="studio-icon-button studio-auto-scroll" aria-label={autoScroll ? "Pause auto-scroll" : "Resume auto-scroll"} onClick={() => setAutoScroll(!autoScroll)}>{autoScroll ? <Pause size={13} /> : <Play size={13} />}</Button></div>
      </section>
      <section className="studio-panel studio-latency-panel"><div className="studio-panel-heading"><div><h2>Latency distribution</h2><p>Request count by response time · last 24h</p></div><span className="studio-kpi-icon"><Activity size={14} /></span></div><div className="studio-histogram" aria-label="Latency histogram">{[17, 33, 54, 75, 96, 82, 61, 43, 26, 13, 7, 3].map((height, index) => <div className="studio-histogram-column" key={height + index}><span style={{ height: `${height}%` }} /><small>{index * 200}</small></div>)}</div><div className="studio-histogram-legend"><span>0 ms</span><span>p50 <strong>482 ms</strong></span><span>p95 <strong>1,842 ms</strong></span><span>2,400+ ms</span></div></section>
    </div>
  );
}

function LogRow({ event }: { event: TelemetryEvent }) {
  return <div className="studio-log-row"><span className="studio-log-time">{event.timestamp}</span><span className={`studio-log-level is-${event.level.toLowerCase()}`}>[{event.level}]</span><span className="studio-log-app">{event.app}</span><span className="studio-log-model">{event.model}</span><span className="studio-log-detail">{event.tokens.toLocaleString()} tk · {event.latency} ms</span><span className={`studio-status studio-status-${event.status}`}>{event.status}</span></div>;
}