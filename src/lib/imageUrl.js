const BACKEND_ORIGIN = (import.meta.env.VITE_BACKEND_URL || "").replace(
  /\/$/,
  "",
);

export function getFullImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${BACKEND_ORIGIN}${image.startsWith("/") ? "" : "/"}${image}`;
}
