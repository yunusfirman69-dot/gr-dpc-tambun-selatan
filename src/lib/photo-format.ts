export type PhotoFit = "cover" | "contain";
export type PhotoPosition = "top" | "center" | "bottom";
export type PhotoShape = "square" | "circle" | "portrait";

export function getOfficialPhotoClasses(options: {
  photoFit?: PhotoFit;
  photoPosition?: PhotoPosition;
  photoShape?: PhotoShape;
  size?: "sm" | "md";
}) {
  const fitClass = options.photoFit === "contain" ? "object-contain bg-[#f7f2ee]" : "object-cover";
  const posClass =
    options.photoPosition === "top"
      ? "object-top"
      : options.photoPosition === "bottom"
        ? "object-bottom"
        : "object-center";

  const isSmall = options.size === "sm";
  const shapeClass =
    options.photoShape === "circle"
      ? isSmall
        ? "h-14 w-14 rounded-full"
        : "h-16 w-16 rounded-full"
      : options.photoShape === "portrait"
        ? isSmall
          ? "h-18 w-14 rounded-2xl"
          : "h-20 w-16 rounded-2xl"
        : isSmall
          ? "h-14 w-14 rounded-2xl"
          : "h-16 w-16 rounded-2xl";

  return `shrink-0 border border-[#e7deda] ${shapeClass} ${fitClass} ${posClass}`;
}
