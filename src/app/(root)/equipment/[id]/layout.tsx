import { Suspense } from "react";

// The page reads useParams(), which suspends during prerender because
// /equipment/[id] has no generateStaticParams. The Suspense boundary gives
// the static shell a fallback to render.
export default function EquipmentDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">Loading equipment details...</div>
      }
    >
      {children}
    </Suspense>
  );
}
