import type { Metadata } from "next";
import { Suspense } from "react";
import { SimulatorTool } from "@/components/tools/SimulatorTool";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("simulator");

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="vn-card">시뮬레이터를 불러오는 중입니다.</div>}>
      <SimulatorTool />
    </Suspense>
  );
}
