import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

type RedisClient = ReturnType<typeof Redis.fromEnv>;

const grades = ["B", "C", "D", "E", "F"] as const;

async function getRedisClient(): Promise<RedisClient | null> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return Redis.fromEnv();
}

function emptyStatsResponse() {
  const gradeCounts = Object.fromEntries(grades.map((grade) => [grade, 0]));
  return NextResponse.json(
    {
      total: 0,
      gradeCounts,
      mostCommon: "B",
      hasEnoughData: false,
      unavailable: "redis_unavailable"
    },
    {
      headers: { "Cache-Control": "public, max-age=300" }
    }
  );
}

export async function POST(request: NextRequest) {
  const { industry, grade, T } = (await request.json()) as {
    industry?: string;
    grade?: string;
    T?: number;
  };

  if (!industry || !grade || typeof T !== "number") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const redis = await getRedisClient();
  if (!redis) {
    return NextResponse.json({ ok: false, skipped: "redis_unavailable" });
  }

  await Promise.all([
    redis.incr(`diagnosis:stats:${industry}:${grade}`),
    redis.lpush(`diagnosis:stats:${industry}:scores`, T),
    redis.ltrim(`diagnosis:stats:${industry}:scores`, 0, 999),
    redis.incr("diagnosis:stats:total")
  ]);

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const industry = request.nextUrl.searchParams.get("industry");
  if (!industry) return NextResponse.json({ error: "industry required" }, { status: 400 });

  const redis = await getRedisClient();
  if (!redis) return emptyStatsResponse();

  const counts = await Promise.all(
    grades.map((grade) => redis.get<number>(`diagnosis:stats:${industry}:${grade}`))
  );
  const total = counts.reduce<number>((sum, count) => sum + (count ?? 0), 0);
  const gradeCounts = Object.fromEntries(grades.map((grade, index) => [grade, counts[index] ?? 0]));
  const mostCommon = grades.reduce((a, b) => (gradeCounts[a] >= gradeCounts[b] ? a : b));

  return NextResponse.json(
    {
      total,
      gradeCounts,
      mostCommon,
      hasEnoughData: total >= 30
    },
    {
      headers: { "Cache-Control": "public, max-age=300" }
    }
  );
}
