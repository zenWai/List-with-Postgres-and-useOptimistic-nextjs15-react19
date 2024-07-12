"use client";
import { AddButton } from "@/app/components/add-button";
import { useOptimistic, useState, useTransition } from "react";
import { deleteAction, saveAction, updateAction } from "@/app/actions";
import { toast } from "sonner";

export default function List({ items }: { items: Item[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items.sort((a, b) => a.id - b.id) || [],
    (state, { action, item }: { action: string; item: Item }) => {
      switch (action) {
        case "delete":
          return state.filter(({ id }) => id !== item.id);
        case "add":
          return [...state, item];
        case "update":
          return state.map((t) => (t.id === item.id ? item : t));
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

  async function updateActionWithId(formData: FormData) {
    const text = formData.get("updateText") as string;
    const itemId = editingItemId;
    startTransition(() => {
      const optimisticItem = {
        id: itemId!,
        text,
        sending: true,
      };
      setOptimisticItems({ action: "update", item: optimisticItem });
    });

    const result = await updateAction(itemId ?? -1, formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.errors?.join(", "));
    }
    console.log(result);
    setEditingItemId(null);
    setEditingText("");
  }
  //const updateActionWithId = (id:number) => updateAction.bind(null, id);

  return (
    <>
      <form action={formAction}>
        <input type="text" name="item" placeholder="add new item to list" />
        <AddButton />
      </form>
      <ul>
        {optimisticItems.map((item, index) => (
          <li key={index}>
            {/* Updating Form */}
            {editingItemId === item.id ? (
              <>
                <form action={updateActionWithId}>
                  <input
                    type="text"
                    name="updateId"
                    value={editingText}
                    onChange={(e) => {
                      if (!item.sending) {
                        setEditingText(e.target.value);
                      }
                    }}
                  />
                  {!item.sending && (
                    <>
                      <button type="submit">Save</button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItemId(null);
                          setEditingText("");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {!!item.sending && <small>`{editingText} (Saving...)`</small>}
                </form>
              </>
            ) : (
              <>
                {item.text}
                {!!item.sending && <small>(Sending...)</small>}
                <button
                  onClick={() => {
                    setEditingItemId(item.id);
                    setEditingText(item.text);
                  }}
                  disabled={isPending}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                >
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
