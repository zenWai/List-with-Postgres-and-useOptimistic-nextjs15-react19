function formatDate(dateString: Date): string {
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

function sortBy(
  items: FormattedItem[],
  order: string | string[],
): FormattedItem[] | undefined {
  switch (order) {
    case "a-z":
      return items.sort((a, b) => a.text.localeCompare(b.text));
    case "z-a":
      return items.sort((a, b) => b.text.localeCompare(a.text));
    case "newest":
      return items.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    case "oldest":
      return items.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    default:
      return;
  }
}

export async function formatItems(
  items: Item[],
  searchParamsReadOnly: Record<string, string | string[] | undefined>,
): Promise<FormattedItem[]> {
  const { sortBy: sortByTerm } = searchParamsReadOnly;

  // Format dates
  let formattedItems: FormattedItem[] = items.map((item) => ({
    ...item,
    formatted_date: formatDate(item.created_at as Date),
  }));

  // Handle sorting options
  if (sortByTerm) {
    formattedItems = sortBy(formattedItems, sortByTerm) ?? formattedItems;
  }

  return formattedItems;
}
