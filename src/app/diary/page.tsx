import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import DiaryLoader from "@/components/DiaryLoader";

const ProductionDiary = dynamic(
  () => import("@/components/ProductionDiary"),
  { loading: () => <DiaryLoader /> }
);

export const metadata: Metadata = {
  title: "Hazlo Realidad | Black Gum",
  description: "Cada cuadro cuenta una historia. Estas son las nuestras."
};

export default function DiaryPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<DiaryLoader />}>
        <ProductionDiary />
      </Suspense>
    </div>
  );
}
