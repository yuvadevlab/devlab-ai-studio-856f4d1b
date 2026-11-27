import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Activity, AppWindow, ArrowUpRight, Check, ChevronDown, Cpu, Hexagon, LayoutDashboard, Plus, SlidersHorizontal, Terminal, X } from "lucide-react";
import { toast } from "sonner";

import { initialApps, initialProviders, type Provider, type StudioApp } from "@/lib/studio-data";
import { Button } from "@/components/ui/button";

type DrawerKind = "provider" | "app" | null;
interface WorkspaceValue {
  providers: Provider[];
  apps: StudioApp[];
  activeApp: string;
  setActiveApp: (slug: string) => void;
  openProvider: (provider?: Provider) => void;
  openApp: (app?: StudioApp) => void;
  updateProvider: (id: string, patch: Partial<Provider>) => void;
  deleteProvider: (id: string) => void;
  updateApp: (id: string, patch: Partial<StudioApp>) => void;
  deleteApp: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function useStudioWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("Studio workspace is not available");
  return value;
}

const navItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Providers", path: "/providers", icon: Cpu },
  { label: "Apps", path: "/apps", icon: AppWindow },
  { label: "Profiles", path: "/profiles", icon: SlidersHorizontal },
  { label: "Telemetry", path: "/telemetry", icon: Activity },
  { label: "Playground", path: "/playground", icon: Terminal },
] as const;

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/providers": "Providers",
  "/apps": "Apps",
  "/profiles": "Profiles",
  "/telemetry": "Telemetry",
  "/playground": "Playground",
};

export function StudioShell() {
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const [providers, setProviders] = useState(initialProviders);
  const [apps, setApps] = useState(initialApps);
  const [activeApp, setActiveApp] = useState("fin-ai");
  const [drawer, setDrawer] = useState<DrawerKind>(null);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [editingApp, setEditingApp] = useState<StudioApp | null>(null);
  const [providerName, setProviderName] = useState("");
  const [providerSlug, setProviderSlug] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [revealKey, setRevealKey] = useState(false);
  const [providerActive, setProviderActive] = useState(true);
  const [appName, setAppName] = useState("");
  const [appSlug, setAppSlug] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [budget, setBudget] = useState("500");
  const [appActive, setAppActive] = useState(true);

  useEffect(() => {
    setProviderName(editingProvider?.name ?? "");
    setProviderSlug(editingProvider?.slug ?? "");
    setApiKey("");
    setRevealKey(false);
    setProviderActive(editingProvider?.active ?? true);
    setAppName(editingApp?.name ?? "");
    setAppSlug(editingApp?.slug ?? "");
    setEndpoint(editingApp?.endpoint ?? "");
    setBudget(String(editingApp?.budget ?? 500));
    setAppActive(editingApp?.active ?? true);
  }, [drawer, editingProvider, editingApp]);

  const closeDrawer = () => {
    setDrawer(null);
    setEditingProvider(null);
    setEditingApp(null);
  };
  const openProvider = (provider?: Provider) => {
    setEditingProvider(provider ?? null);
    setEditingApp(null);
    setDrawer("provider");
  };
  const openApp = (app?: StudioApp) => {
    setEditingApp(app ?? null);
    setEditingProvider(null);
    setDrawer("app");
  };
  const updateProvider = (id: string, patch: Partial<Provider>) => {
    setProviders((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  };
  const deleteProvider = (id: string) => setProviders((items) => items.filter((item) => item.id !== id));
  const updateApp = (id: string, patch: Partial<StudioApp>) => {
    setApps((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  };
  const deleteApp = (id: string) => setApps((items) => items.filter((item) => item.id !== id));
  const workspace = useMemo(() => ({ providers, apps, activeApp, setActiveApp, openProvider, openApp, updateProvider, deleteProvider, updateApp, deleteApp }), [providers, apps, activeApp]);

  const submitProvider = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const slug = providerSlug.trim() || providerName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const current: Provider = {
      id: editingProvider?.id ?? `provider-${Date.now()}`,
      name: providerName.trim(),
      slug,
      active: providerActive,
      models: editingProvider?.models ?? 0,
      spend: editingProvider?.spend ?? 0,
      color: editingProvider?.color ?? "indigo",
    };
    setProviders((items) => editingProvider ? items.map((item) => item.id === current.id ? current : item) : [...items, current]);
    toast.success(editingProvider ? "Provider updated" : "Provider added", { description: `${current.name} is ready in this demo workspace.` });
    closeDrawer();
  };

  const submitApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const slug = appSlug.trim() || appName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const current: StudioApp = {
      id: editingApp?.id ?? `app-${Date.now()}`,
      name: appName.trim(),
      slug,
      endpoint: endpoint.trim(),
      budget: Number(budget) || 0,
      active: appActive,
      created: editingApp?.created ?? "Today",
    };
    setApps((items) => editingApp ? items.map((item) => item.id === current.id ? current : item) : [...items, current]);
    toast.success(editingApp ? "App updated" : "App registered", { description: `${current.name} is ready in this demo workspace.` });
    closeDrawer();
  };

  const currentPage = pageTitles[pathname] ?? "Overview";
  const selectedApp = apps.find((app) => app.slug === activeApp) ?? apps[0];

  return (
    <WorkspaceContext.Provider value={workspace}>
      <div className="studio-layout">
        <aside className="studio-sidebar">
          <Link to="/" className="studio-brand" aria-label="DevLab AI Studio overview">
            <span className="studio-brand-mark"><Hexagon size={20} strokeWidth={2.2} /></span>
            <span className="studio-brand-name">DevLab<span>AI</span></span>
            <span className="studio-brand-build">STUDIO</span>
          </Link>
          <div className="studio-sidebar-label">WORKSPACE</div>
          <label className="studio-app-switcher">
            <span className="studio-app-switcher-icon"><AppWindow size={15} /></span>
            <select aria-label="Active app" value={selectedApp?.slug ?? ""} onChange={(event) => setActiveApp(event.target.value)}>
              {apps.map((app) => <option key={app.id} value={app.slug}>{app.slug}</option>)}
            </select>
            <ChevronDown size={14} />
          </label>
          <div className="studio-sidebar-label studio-nav-caption">PLATFORM</div>
          <nav className="studio-navigation" aria-label="Main navigation">
            {navItems.map(({ label, path, icon: Icon }) => {
              const active = pathname === path;
              return (
                <Link key={path} to={path} className={`studio-nav-item${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                  {label === "Telemetry" && <span className="studio-live-dot" aria-label="Live" />}
                </Link>
              );
            })}
          </nav>
          <div className="studio-sidebar-bottom">
            <div className="studio-usage-line"><span>Monthly budget</span><strong>$1,250 <span>/ $2,500</span></strong></div>
            <div className="studio-usage-track"><span /></div>
            <div className="studio-user-row">
              <span className="studio-avatar">YP</span>
              <span className="studio-user-copy"><strong>Yuvaraj Pattabi</strong><small>Workspace admin</small></span>
              <Button variant="ghost" size="icon" className="studio-icon-button" aria-label="Account options"><ChevronDown size={15} /></Button>
            </div>
          </div>
        </aside>

        <div className="studio-main-column">
          <header className="studio-topbar">
            <div className="studio-breadcrumb"><span>Workspace</span><span className="studio-breadcrumb-divider">/</span><strong>{currentPage}</strong></div>
            <div className="studio-topbar-actions">
              <span className="studio-topbar-app"><span className="studio-live-dot" />{selectedApp?.slug ?? "workspace"}</span>
              <span className="studio-topbar-separator" />
              <Button variant="outline" className="studio-button studio-provider-cta" onClick={() => openProvider()}><Plus size={15} /> New Provider</Button>
              <Button variant="ghost" size="icon" className="studio-icon-button studio-notification" aria-label="Notifications" onClick={() => toast("You're all caught up", { description: "No new workspace notifications." })}><span className="studio-notification-indicator" /><Activity size={17} /></Button>
            </div>
          </header>
          <main className="studio-main"><Outlet /></main>
          <footer className="studio-footer"><span>DEVLAB AI STUDIO <i>·</i> CONTROL PLANE</span><a href="https://docs.lovable.dev" target="_blank" rel="noreferrer">Gateway status <ArrowUpRight size={12} /></a></footer>
        </div>
        {drawer && <>
          <Button variant="ghost" className="studio-drawer-backdrop" aria-label="Close dialog" onClick={closeDrawer} />
          <aside className="studio-drawer" role="dialog" aria-modal="true" aria-labelledby="studio-drawer-title">
            <div className="studio-drawer-header">
              <div><p className="studio-eyebrow">WORKSPACE CONFIGURATION</p><h2 id="studio-drawer-title">{drawer === "provider" ? editingProvider ? "Edit provider" : "Add provider" : editingApp ? "Edit app" : "Register app"}</h2></div>
              <Button variant="ghost" size="icon" className="studio-icon-button" aria-label="Close" onClick={closeDrawer}><X size={17} /></Button>
            </div>
            {drawer === "provider" ? (
              <form className="studio-drawer-form" onSubmit={submitProvider}>
                <p className="studio-form-note">Connect a model provider to your shared gateway.</p>
                <label className="studio-field"><span>Provider name</span><input className="studio-input" value={providerName} required placeholder="e.g. OpenAI" onChange={(event) => { setProviderName(event.target.value); if (!editingProvider) setProviderSlug(event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} /></label>
                <label className="studio-field"><span>Provider slug</span><input className="studio-input studio-input-mono" value={providerSlug} required placeholder="openai" onChange={(event) => setProviderSlug(event.target.value)} /></label>
                <label className="studio-field"><span>API key <small>— demo only, never stored</small></span><div className="studio-input-action"><input className="studio-input studio-input-mono" type={revealKey ? "text" : "password"} value={apiKey} placeholder="sk-••••••••••••••••" onChange={(event) => setApiKey(event.target.value)} /><Button variant="ghost" size="icon" className="studio-icon-button" type="button" aria-label={revealKey ? "Hide API key" : "Reveal API key"} onClick={() => setRevealKey(!revealKey)}>{revealKey ? <X size={15} /> : <Activity size={15} />}</Button></div></label>
                <label className="studio-toggle-row"><span><strong>Provider active</strong><small>Route traffic to this provider</small></span><input type="checkbox" checked={providerActive} onChange={(event) => setProviderActive(event.target.checked)} /></label>
                <div className="studio-drawer-actions"><Button variant="outline" className="studio-button" type="button" onClick={closeDrawer}>Cancel</Button><Button className="studio-button studio-button-primary" type="submit"><Check size={15} /> {editingProvider ? "Save changes" : "Save provider"}</Button></div>
              </form>
            ) : (
              <form className="studio-drawer-form" onSubmit={submitApp}>
                <p className="studio-form-note">Register a client application for routed model access.</p>
                <label className="studio-field"><span>App name</span><input className="studio-input" value={appName} required placeholder="e.g. Fin AI" onChange={(event) => { setAppName(event.target.value); if (!editingApp) setAppSlug(event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} /></label>
                <label className="studio-field"><span>App slug</span><input className="studio-input studio-input-mono" value={appSlug} required placeholder="fin-ai" onChange={(event) => setAppSlug(event.target.value)} /></label>
                <label className="studio-field"><span>MCP endpoint <small>— optional</small></span><input className="studio-input studio-input-mono" type="url" value={endpoint} placeholder="https://api.example.com/mcp" onChange={(event) => setEndpoint(event.target.value)} /></label>
                <label className="studio-field"><span>Monthly budget <small>USD</small></span><div className="studio-money-input"><span>$</span><input className="studio-input" type="number" min="0" step="1" value={budget} onChange={(event) => setBudget(event.target.value)} /></div></label>
                <label className="studio-toggle-row"><span><strong>App active</strong><small>Allow requests from this app</small></span><input type="checkbox" checked={appActive} onChange={(event) => setAppActive(event.target.checked)} /></label>
                <div className="studio-drawer-actions"><Button variant="outline" className="studio-button" type="button" onClick={closeDrawer}>Cancel</Button><Button className="studio-button studio-button-primary" type="submit"><Check size={15} /> {editingApp ? "Save changes" : "Register app"}</Button></div>
              </form>
            )}
          </aside>
        </>}
      </div>
    </WorkspaceContext.Provider>
  );
}