export type RunStatus = "success" | "error" | "streaming";
export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface Provider {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  models: number;
  spend: number;
  color: "indigo" | "copper" | "sky" | "slate";
}

export interface StudioApp {
  id: string;
  name: string;
  slug: string;
  endpoint: string;
  budget: number;
  active: boolean;
  created: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  version: string;
  model: string;
  preset: "Analytical" | "Balanced" | "Creative";
  maxTurns: number;
  maxTokens: number;
}

export interface ModelRun {
  app: string;
  model: string;
  tokens: number;
  cost: number;
  status: RunStatus;
  time: string;
}

export interface TelemetryEvent {
  timestamp: string;
  app: string;
  model: string;
  tokens: number;
  latency: number;
  status: RunStatus;
  level: LogLevel;
  message: string;
}

export const initialProviders: Provider[] = [
  { id: "openai", name: "OpenAI", slug: "openai", active: true, models: 8, spend: 248.37, color: "indigo" },
  { id: "anthropic", name: "Anthropic", slug: "anthropic", active: true, models: 5, spend: 184.92, color: "copper" },
  { id: "google", name: "Google Gemini", slug: "google-gemini", active: true, models: 6, spend: 71.48, color: "sky" },
  { id: "mistral", name: "Mistral AI", slug: "mistral", active: false, models: 3, spend: 12.63, color: "slate" },
];

export const initialApps: StudioApp[] = [
  { id: "fin-ai", name: "Fin AI", slug: "fin-ai", endpoint: "https://api.devlab.ai/mcp/fin-ai", budget: 1200, active: true, created: "Nov 04, 2025" },
  { id: "orchestr-ai", name: "Orchestr AI", slug: "orchestr-ai", endpoint: "https://api.devlab.ai/mcp/orchestr-ai", budget: 800, active: true, created: "Nov 12, 2025" },
  { id: "devlab-logs", name: "DevLab Logs", slug: "devlab-logs", endpoint: "https://api.devlab.ai/mcp/devlab-logs", budget: 400, active: true, created: "Dec 01, 2025" },
  { id: "devlab-portal", name: "DevLab Portal", slug: "devlab-portal", endpoint: "", budget: 250, active: false, created: "Jan 19, 2026" },
];

export const initialProfiles: AgentProfile[] = [
  { id: "support-agent", name: "Support Agent", version: "v2.4", model: "claude-3-7-sonnet", preset: "Balanced", maxTurns: 12, maxTokens: 8192 },
  { id: "research-copilot", name: "Research Copilot", version: "v1.8", model: "gpt-4.1", preset: "Analytical", maxTurns: 24, maxTokens: 16384 },
  { id: "creative-studio", name: "Creative Studio", version: "v1.2", model: "gemini-2.5-pro", preset: "Creative", maxTurns: 8, maxTokens: 4096 },
];

export const recentRuns: ModelRun[] = [
  { app: "fin-ai", model: "gpt-4.1", tokens: 1842, cost: 0.0184, status: "success", time: "12 sec ago" },
  { app: "orchestr-ai", model: "claude-3-7-sonnet", tokens: 4980, cost: 0.0438, status: "success", time: "38 sec ago" },
  { app: "devlab-logs", model: "gemini-2.5-flash", tokens: 924, cost: 0.0021, status: "streaming", time: "1 min ago" },
  { app: "fin-ai", model: "gpt-4.1-mini", tokens: 1264, cost: 0.0038, status: "success", time: "2 min ago" },
  { app: "orchestr-ai", model: "claude-3-7-sonnet", tokens: 0, cost: 0, status: "error", time: "3 min ago" },
  { app: "devlab-portal", model: "mistral-large", tokens: 2140, cost: 0.0126, status: "success", time: "4 min ago" },
  { app: "fin-ai", model: "gpt-4.1", tokens: 3862, cost: 0.0361, status: "success", time: "5 min ago" },
  { app: "orchestr-ai", model: "gemini-2.5-pro", tokens: 2482, cost: 0.0192, status: "success", time: "7 min ago" },
  { app: "devlab-logs", model: "gpt-4.1-mini", tokens: 702, cost: 0.0021, status: "success", time: "9 min ago" },
  { app: "fin-ai", model: "claude-3-7-sonnet", tokens: 3186, cost: 0.0287, status: "success", time: "11 min ago" },
];

export const topModels = [
  { name: "claude-3-7-sonnet", provider: "Anthropic", cost: 184.92, requests: "18.4k", share: 76 },
  { name: "gpt-4.1", provider: "OpenAI", cost: 132.58, requests: "11.2k", share: 58 },
  { name: "gemini-2.5-pro", provider: "Google", cost: 71.48, requests: "9.6k", share: 35 },
  { name: "gpt-4.1-mini", provider: "OpenAI", cost: 42.31, requests: "26.1k", share: 23 },
  { name: "mistral-large", provider: "Mistral", cost: 12.63, requests: "2.8k", share: 12 },
];

export const initialTelemetry: TelemetryEvent[] = [
  { timestamp: "12:07:42.018", app: "fin-ai", model: "gpt-4.1", tokens: 1842, latency: 482, status: "success", level: "INFO", message: "completion.created · request routed" },
  { timestamp: "12:07:40.561", app: "orchestr-ai", model: "claude-3-7-sonnet", tokens: 4980, latency: 1248, status: "success", level: "INFO", message: "tool_call.completed · 3 tools" },
  { timestamp: "12:07:38.404", app: "devlab-logs", model: "gemini-2.5-flash", tokens: 924, latency: 0, status: "streaming", level: "WARN", message: "stream.open · response in progress" },
  { timestamp: "12:07:35.119", app: "orchestr-ai", model: "claude-3-7-sonnet", tokens: 0, latency: 2400, status: "error", level: "ERROR", message: "provider.timeout · retry scheduled" },
  { timestamp: "12:07:30.992", app: "fin-ai", model: "gpt-4.1-mini", tokens: 1264, latency: 219, status: "success", level: "INFO", message: "completion.created · request routed" },
  { timestamp: "12:07:26.744", app: "devlab-portal", model: "mistral-large", tokens: 2140, latency: 806, status: "success", level: "INFO", message: "completion.created · fallback used" },
  { timestamp: "12:07:19.208", app: "fin-ai", model: "gpt-4.1", tokens: 3862, latency: 1094, status: "success", level: "INFO", message: "completion.created · request routed" },
  { timestamp: "12:07:15.876", app: "orchestr-ai", model: "gemini-2.5-pro", tokens: 2482, latency: 1463, status: "success", level: "INFO", message: "completion.created · request routed" },
  { timestamp: "12:07:08.331", app: "devlab-logs", model: "gpt-4.1-mini", tokens: 702, latency: 172, status: "success", level: "INFO", message: "completion.created · request routed" },
  { timestamp: "12:06:59.117", app: "fin-ai", model: "claude-3-7-sonnet", tokens: 3186, latency: 936, status: "success", level: "INFO", message: "completion.created · request routed" },
];