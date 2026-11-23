import ProductStage from "@/components/ProductStage";

// The flagship card's right-hand "Interactive Preview" panel: the same lively product stage as the
// split hero (3-second photo cycle, float, tilt, chips per labelled photo) on the brand-green panel.
// Photos, labels and captions come from the product's photo manager (lib/productPhotos.js).
export default function FlagshipPreview({ title, photos }) {
  if (photos.length === 0) return null;

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-brand-deep p-6 text-white sm:p-10">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
          Interactive Preview
        </span>
        <h4 className="mt-1 text-lg font-bold">{title}</h4>
      </div>
      <div className="mt-6">
        <ProductStage photos={photos} size={270} />
      </div>
    </div>
  );
}
