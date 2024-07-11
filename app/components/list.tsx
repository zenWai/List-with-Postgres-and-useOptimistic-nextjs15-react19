"use client";
import { AddButton } from "@/app/components/add-button";
import { useOptimistic, useTransition } from "react";
import { deleteAction, saveAction } from "@/app/actions";
import { toast } from "sonner";

export default function List({ items }: { items: Item[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items || [],
    (state, { action, item }: { action: string; item: Item }) => {
      switch (action) {
        case "delete":
          return state.filter(({ id }) => id !== item.id);
        case "add":
          return [...state, item];
        default:
          return state;
      }
    },
  );

  async function formAction(formData: FormData) {
    const newItem = formData.get("item") as string;
    console.log(typeof newItem); // string
    const optimisticItem = {
      id: optimisticItems.length + 1,
      text: newItem,
      sending: true,
    };
    setOptimisticItems({ action: "add", item: optimisticItem });
    const result = await saveAction(formData);
    if (result.success) {
      toast.success(`( ${newItem.toString()} ) added successfully 👍`);
    } else {
      const message = result.errors ?? "";
      toast.error(`Could not save ${message[0]} - Please Try again`);
    }
  }

  async function handleDelete(id: number) {
    // useOptimistic should be used inside useTransition or action
    startTransition(() => {
      const optimisticItem = {
        id: id,
        text: "",
        sending: false,
      };
      setOptimisticItems({ action: "delete", item: optimisticItem });
    });
    const result = await deleteAction(id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <>
      <form action={formAction}>
        <input type="text" name="item" placeholder="add new item to list" />
        <AddButton />
      </form>
      <ul>
        {optimisticItems.map((item, index) => (
          <li key={index}>
            {item.text}
            {!!item.sending && <small>(Sending...)</small>}
            <button onClick={() => handleDelete(item.id)} disabled={isPending}>
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
