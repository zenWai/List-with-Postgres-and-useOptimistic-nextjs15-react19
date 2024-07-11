"use client";
import { useOptimistic } from "react";
import { saveAction } from "@/app/actions";

export default function List({ items }: { items: Item[] }) {
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items || [],
    (state, newItemText) => [
      ...state,
      {
        id: state.length + 1,
        text: newItemText as string,
        sending: true,
      },
    ],
  );

  async function formAction(formData: FormData) {
    const newItem = formData.get("item");
    if (newItem) {
      addOptimisticItem(newItem);
      await saveAction(formData);
    }
  }

  return (
    <>
      <form action={formAction}>
        <input type="text" name="item" placeholder="add new item to list" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticItems.map((item, index) => (
          <li key={index}>
            {item.text}
            {!!item.sending && <small>(Sending...)</small>}
          </li>
        ))}
      </ul>
    </>
  );
}
