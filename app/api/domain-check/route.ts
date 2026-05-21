import { NextRequest, NextResponse } from "next/server";

export type DomainCheckResult = {
  alive: boolean;
  title: string | null;
  description: string | null;
  robotsBlocked: boolean;
  hasMobileViewport: boolean;
  error: string | null;
};

function extractMeta(html: string, name: string): string | null {
  const match =
    html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i")) ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i"));
  return match?.[1] ?? null;
}

function extractTitle(html: string): string | null {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "domain required" }, { status: 400 });

  const url = domain.startsWith("http") ? domain : `https://${domain}`;
  const result: DomainCheckResult = {
    alive: false,
    title: null,
    description: null,
    robotsBlocked: false,
    hasMobileViewport: false,
    error: null
  };

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "VELNOC-DiagnosisBot/1.0" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow"
    });
    result.alive = res.ok;

    if (res.ok) {
      const html = await res.text();
      result.title = extractTitle(html);
      result.description = extractMeta(html, "description");
      result.hasMobileViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    }

    const robotsUrl = new URL("/robots.txt", url).toString();
    const robotsRes = await fetch(robotsUrl, {
      signal: AbortSignal.timeout(4000)
    }).catch(() => null);

    if (robotsRes?.ok) {
      const robotsTxt = await robotsRes.text();
      result.robotsBlocked = /Disallow:\s*\//i.test(robotsTxt);
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : "fetch failed";
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, max-age=3600" }
  });
}
