export function slugifyAirline(name) {
  return (name || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export function deslugifyAirline(slug) {
  return (slug || "unknown")
    .replace(/-/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}