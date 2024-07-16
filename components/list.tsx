"use client";
import { ItemOfList } from "@/components/item-of-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOptimistic, useState, useTransition } from "react";
import { deleteAction, saveAction, updateAction } from "@/app/actions";
import { toast } from "sonner";

type ListProps = {
  items: Item[];
  user: User;
};

export default function List({ items, user }: ListProps) {
  const [isPending, startTransition] = useTransition();
  const [editingItem, setEditingItem] = useState<Item | null>();
  const [editingText, setEditingText] = useState<string>("");
  //const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items || [],
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
      user_id: user.id,
      text: newItem,
      sending: true,
      created_at: "",
    };
    setOptimisticItems({ action: "add", item: optimisticItem });
    const result = await saveAction(formData, user.id);
    if (result.success) {
      toast.success(`( ${newItem.toString()} ) added successfully 👍`);
    } else {
      const errorMessage = result.errors;
      toast.error(`Could not save ${errorMessage} - Please Try again`);
    }
  }

  async function handleDelete(id: number) {
    startTransition(() => {
      const optimisticItem = {
        id: id,
        text: "",
        user_id: user.id,
        sending: false,
        created_at: "",
      };
      setOptimisticItems({ action: "delete", item: optimisticItem });
    });
    const result = await deleteAction(id, user.id);
    if (result.success) {
      toast.success(result.message);
    } else {
      const errorMessage = result.errors;
      toast.error(`Could not delete ${errorMessage} - Please Try again`);
    }
  }

  async function updateActionWithId(formData: FormData) {
    const text = formData.get("updateText") as string;
    const item = editingItem;
    if (!item?.id) return;
    startTransition(() => {
      const optimisticItem = {
        id: item.id,
        user_id: user.id,
        text,
        created_at: item?.created_at ?? "",
        sending: true,
      };
      setOptimisticItems({ action: "update", item: optimisticItem });
    });

    const result = await updateAction(item.id, formData, user.id);
    if (result.success) {
      toast.success(result.message);
    } else {
      const errorMessage = result.errors;
      toast.error(`Could not update ${errorMessage} - Please Try again`);
    }
    setEditingItem(null);
    setEditingText("");
  }
  //const updateActionWithId = (id:number) => updateAction.bind(null, id);

  return (
    <div className="flex flex-col gap-8 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Hello User {user.name}</h1>
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
      {!optimisticItems?.length && (
        <div className="flex flex-center justify-center contain-content bg-gray-600/15 mx-auto text-5xl text-green-700 py-2 px-2">
          No items available, please Add some items
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-min">
        {optimisticItems.map((item, index) => (
          <ItemOfList
            key={index}
            item={{
              id: item.id,
              name: item.text,
              created_at: item.created_at as string,
            }}
            onEdit={() => {
              setEditingItem(item);
              setEditingText(item.text);
            }}
            onDelete={() => handleDelete(item.id)}
            isSending={!!item.sending}
            isEditing={editingItem?.id === item.id}
            onEditChange={(e) => {
              setEditingText(e.target.value);
            }}
            onSaveEdit={updateActionWithId}
            onCancelEdit={() => {
              setEditingItem(null);
              setEditingText("");
            }}
            editingText={editingText}
          />
        ))}
      </div>
    </div>
  );
}
