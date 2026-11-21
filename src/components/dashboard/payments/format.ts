const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

/** Formats an amount as Bangladeshi Taka, e.g. ৳69,986. */
export function formatBDT(amount: number): string {
  return `৳${numberFormatter.format(Math.round(amount))}`;
}

/** Short readable date, e.g. "Nov 20, 2026". */
export function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Long readable date, e.g. "November 20, 2026". */
export function formatLongDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Time only, e.g. "2:35 PM". */
export function formatTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Keeps long transaction IDs scannable: "pi_3UdtE9R1qM…NObB". */
export function truncateTransactionId(id: string): string {
  if (id.length <= 18) {
    return id;
  }

  return `${id.slice(0, 13)}…${id.slice(-4)}`;
}
