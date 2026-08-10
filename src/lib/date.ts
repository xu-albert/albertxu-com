// Content dates are bare `YYYY-MM-DD`, which `new Date()` reads as UTC
// midnight — a negative UTC offset then renders the previous day. Parsing
// with an explicit time keeps it local, so every page shows the same date.
export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
