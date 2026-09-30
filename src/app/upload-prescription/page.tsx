import type { Metadata } from "next";
import { UploadPrescriptionView } from "@/components/rx/UploadPrescriptionView";

export const metadata: Metadata = { title: "Upload prescription" };

export default function UploadPrescriptionPage() {
  return <UploadPrescriptionView />;
}
