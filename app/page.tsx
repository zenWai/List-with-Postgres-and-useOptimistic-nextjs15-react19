import List from "@/components/list";
import { getItems } from "@/app/db";

export default async function HomePage() {
  const items = await getItems();
  return (
    <>
      <List items={items} />
    </>
  );
}
