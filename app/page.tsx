import Loading from "@/app/loading";
import List from "@/components/list";
import { getItems } from "@/app/db";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function HomePage() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value as string;
  const items = await getItems(userId);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <List items={items} userId={userId} />
      </Suspense>
    </>
  );
}
