interface Item {
  id: number;
  text: string;
  sending?: boolean;
  created_at: Date | string;
}

interface User {
  id: string;
  name: string;
  created_at: Date | string;
}
