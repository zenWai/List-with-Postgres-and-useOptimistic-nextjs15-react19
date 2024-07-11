"use client";
import { useOptimistic } from "react";
import { saveAction } from "@/app/actions";
import { toast } from "sonner";

export default function List({ items }: { items: Item[] }) {
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items || [],
    (state, newItemText) => [
      ...state,
      {
        id: state.length + 1,
        text: newItemText as string,
        sending: true
      }
    ]
  );

  async function formAction(formData: FormData) {
    const newItem = formData.get("item") as string;
    console.log(typeof newItem); // string

    addOptimisticItem(newItem);
    const result = await saveAction(formData);
    if (result.success) {
      toast.success(`( ${newItem.toString()} ) added successfully 👍`);
    } else {
      const message = result.errors ?? "";
      toast.error(`Could not save ${message[0]} - Please Try again`);
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
