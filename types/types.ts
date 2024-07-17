interface Item {
  id: number;
  text: string;
  created_at: Date | string;
}

interface FormattedItem extends Item {
  formatted_date: string;
  sending?: boolean;
}

interface User {
  id: string;
  name: string;
  created_at: Date | string;
}
