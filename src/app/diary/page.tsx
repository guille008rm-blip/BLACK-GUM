import type { Metadata } from "next";
import ProductionDiary from "@/components/ProductionDiary";

export const metadata: Metadata = {
  title: "Portfolio | Black Gum",
  description: "Nuestro trabajo: color, grabación, edición y más. Un vistazo a lo que hacemos.",
};

export default function DiaryPage() {
  return (
    <div className="w-full">
      <ProductionDiary />
    </div>
  );
}
