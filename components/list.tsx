"use client";
import { ItemOfList } from "@/components/item-of-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOptimistic, useState, useTransition } from "react";
import { deleteAction, saveAction, updateAction } from "@/app/actions";
import { toast } from "sonner";

interface ListProps {
  items: Item[];
  userId: string;
}

export default function List({ items, userId }: ListProps) {
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
      user_id: userId,
      text: newItem,
      sending: true,
    };
    setOptimisticItems({ action: "add", item: optimisticItem });
    const result = await saveAction(formData, userId);
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
        user_id: userId,
        sending: false,
      };
      setOptimisticItems({ action: "delete", item: optimisticItem });
    });
    const result = await deleteAction(id, userId);
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
        user_id: userId,
        text,
        sending: true,
      };
      setOptimisticItems({ action: "update", item: optimisticItem });
    });

    const result = await updateAction(itemId ?? -1, formData, userId);
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
    <div className="flex flex-col gap-8 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Hello User X</h1>
          <h2>Server has an artificial delay of 2 seconds</h2>
          <p>{`await new Promise((res) => setTimeout(res, 2000)); on top of every action`}</p>
          <p>Enjoy the lag!</p>
        </div>

        <div className="flex items-center gap-4">
          <form className="flex items-center gap-2" action={formAction}>
            <Input
              type="text"
              name="item"
              placeholder="Add new item"
              className="max-w-[200px] sm:max-w-[300px] transition-colors duration-300 hover:bg-muted focus:bg-muted"
            />
            <Button
              size="sm"
              className="transition-colors duration-300 hover:bg-primary/80"
              type="submit"
            >
              Add
            </Button>
          </form>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-min">
        {!optimisticItems?.length && (
          <div>Nothing to see here, unless you add some items.</div>
        )}
        {optimisticItems.map((item, index) => (
          <ItemOfList
            key={index}
            item={{
              id: item.id,
              name: item.text,
            }}
            onEdit={() => {
              setEditingItemId(item.id);
              setEditingText(item.text);
            }}
            onDelete={() => handleDelete(item.id)}
            isSending={!!item.sending}
            isEditing={editingItemId === item.id}
            onEditChange={(e) => {
              setEditingText(e.target.value);
            }}
            onSaveEdit={updateActionWithId}
            onCancelEdit={() => {
              setEditingItemId(null);
              setEditingText("");
            }}
            editingText={editingText}
          />
        ))}
      </div>
    </div>
  );
}
