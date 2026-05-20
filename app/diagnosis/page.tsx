import type { Metadata } from "next";
import { DiagnosisTool } from "@/components/tools/DiagnosisTool";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata("diagnosis");

export default function DiagnosisPage() {
  return <DiagnosisTool />;
}
