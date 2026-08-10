const BACKEND_ORIGIN = "http://localhost:8081";

export function getFullImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${BACKEND_ORIGIN}${image.startsWith("/") ? "" : "/"}${image}`;
}
