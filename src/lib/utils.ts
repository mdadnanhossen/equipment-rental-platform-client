export { cn } from "cn";

/**
 * Avatar initials from a display name: "Ada Lovelace" → "AL".
 * Falls back to the first two characters for single-word names.
 */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
  return (initials || name.slice(0, 2) || "?").toUpperCase();
}
