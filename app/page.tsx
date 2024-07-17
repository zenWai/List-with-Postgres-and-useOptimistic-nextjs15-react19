import { getItems } from "@/app/db";
import List from "@/components/list";
import { cookies } from "next/headers";
import { formatItems } from "@/utils/formatItemsData";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId)
    return (
      <div>
        Count not Identify you, reload the page and the issue should be resolved
      </div>
    );

  const delay = searchParams.delay !== "false";
  const { items, user } = await getItems(userId, delay);
  const formattedItems = await formatItems(items, searchParams);

  return (
    <>
        <List items={formattedItems} user={user} isDelayEnabled={delay}/>
    </>
  );
}
