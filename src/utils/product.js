export function hasProductTag(product, tagName) {
  if (!Array.isArray(product.tags)) {
    return false;
  }

  return product.tags.some((tag) => {
    const name = typeof tag === "object" && tag !== null ? tag.name : tag;

    return (
      typeof name === "string" && name.toLowerCase() === tagName.toLowerCase()
    );
  });
}
