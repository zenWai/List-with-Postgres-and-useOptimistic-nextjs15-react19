function formatDate(dateString: Date | string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
}

export async function formatItems(items: Item[]) {
  return [...items]
    .map((item) => ({ ...item, created_at: formatDate(item.created_at) }))
    .sort((a, b) => a.id - b.id);
}
