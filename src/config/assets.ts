export function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function imagePath(path: string) {
  return assetPath(`images/${path.replace(/^\//, "")}`);
}
