import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@portfolio/content";
import { useClock } from "../lib/hooks.ts";
import { GitHubIcon } from "./ui.tsx";

interface Repo {
  name: string;
  url: string;
  language: string | null;
  pushedAt: string;
}

const CACHE_KEY = "gh-recent-repos-v1";
const CACHE_MS = 10 * 60 * 1000;

async function loadRecentRepos(signal: AbortSignal): Promise<Repo[]> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null") as { at: number; repos: Repo[] } | null;
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.repos;
  } catch {
    /* storage unavailable — just fetch */
  }

  const res = await fetch(
    `https://api.github.com/users/${profile.githubUser}/repos?sort=pushed&per_page=12`,
    { signal, headers: { Accept: "application/vnd.github+json" } },
  );
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const data = (await res.json()) as Array<{
    name: string;
    html_url: string;
    language: string | null;
    pushed_at: string;
    fork: boolean;
  }>;
  const repos = data
    .filter((r) => !r.fork)
    .slice(0, 3)
    .map((r) => ({ name: r.name, url: r.html_url, language: r.language, pushedAt: r.pushed_at }));

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
  } catch {
    /* ignore */
  }
  return repos;
}

const rtf = typeof Intl !== "undefined" ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }) : null;
function ago(iso: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of steps) {
    if (Math.abs(diff) >= secs) return rtf?.format(Math.round(diff / secs), unit) ?? "";
  }
  return "just now";
}

export function NowCard() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);
  const time = useClock(profile.timezone);

  useEffect(() => {
    const ctrl = new AbortController();
    loadRecentRepos(ctrl.signal)
      .then(setRepos)
      .catch((e: unknown) => {
        if ((e as Error)?.name !== "AbortError") setFailed(true);
      });
    return () => ctrl.abort();
  }, []);

  return (
    <aside
      aria-label="What I'm doing now"
      className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7"
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
        <span>Now</span>
        <span className="flex items-center gap-2 normal-case tracking-normal text-muted">
          <span className="size-1.5 rounded-full bg-accent" />
          {profile.location.split(",")[0]} {time && `· ${time} ${profile.timezoneLabel}`}
        </span>
      </div>

      <dl className="mt-6 grid gap-3.5">
        {profile.now.map((row) => (
          <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-3 text-[15px]">
            <dt className="text-subtle">{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>

      {!failed && (
        <>
          <div className="my-6 h-px bg-line" />
          <p className="mb-3 flex items-center gap-2 font-mono text-[11px] text-subtle">
            <GitHubIcon className="size-3.5" /> Recently updated on GitHub
          </p>
          <ul className="grid gap-1">
            {(repos ?? [null, null, null]).map((r, i) =>
              r ? (
                <li key={r.name}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 font-mono text-[12.5px] transition-colors hover:bg-surface-2"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-fg">{r.name}</span>
                      {r.language && <span className="hidden shrink-0 text-subtle sm:inline">· {r.language}</span>}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-subtle">
                      {ago(r.pushedAt)}
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </a>
                </li>
              ) : (
                <li key={i} aria-hidden className="flex items-center justify-between py-2">
                  <span className="h-2.5 w-2/5 animate-pulse rounded-full bg-surface-2" />
                  <span className="h-2.5 w-14 animate-pulse rounded-full bg-surface-2" />
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </aside>
  );
}
