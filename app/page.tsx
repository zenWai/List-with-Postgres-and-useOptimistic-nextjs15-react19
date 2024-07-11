import List from "@/app/components/list";
import { getItems } from "@/app/db";

export default async function HomePage() {
  const items = await getItems();
  return (
    <>
      <h1>List</h1>
      <List items={items} />
    </>
  );
}
