import type { Metadata } from "next";
import { Suspense } from "react";
import { DiagnosisTool } from "@/components/tools/DiagnosisTool";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("diagnosis");

export default function DiagnosisPage() {
  return (
    <Suspense fallback={null}>
      <DiagnosisTool />
    </Suspense>
  );
}
