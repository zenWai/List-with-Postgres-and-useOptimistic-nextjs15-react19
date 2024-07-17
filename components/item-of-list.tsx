import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FilePenIcon } from "@/components/ui/icons/file-pen-icon";
import { TrashIcon } from "@/components/ui/icons/trash-icon";

interface ItemProps {
  item: FormattedItem;
  onEdit: () => void;
  onDelete: () => void;
  isSending: boolean;
  isEditing: boolean;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: (formData: FormData) => Promise<void>;
  onCancelEdit: () => void;
  editingText: string;
}

export function ItemOfList({
  item,
  onEdit,
  onDelete,
  isSending,
  isEditing,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  editingText,
}: ItemProps) {
  return (
    <div className="group flex flex-col items-start gap-2 rounded-lg border bg-background p-4 transition-colors duration-300 hover:bg-muted hover:scale-105 h-full">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {isEditing ? (
            <form action={onSaveEdit} className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                name="updateText"
                value={editingText}
                onChange={onEditChange}
                className="flex-1"
                disabled={isSending}
              />
              {!isSending && (
                <div className="flex gap-2">
                  <Button type="submit" size="sm" variant={"outline"}>
                    Save
                  </Button>
                  <Button
                    type="button"
                    onClick={onCancelEdit}
                    size="sm"
                    variant={"outline"}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <div
                className="flex-1 text-sm font-medium break-words overflow-hidden"
                style={{ wordBreak: "break-word" }}
              >
                {isSending && <span className="">(Saving...)</span>}
              </div>
            </form>
          ) : (
            <div
              className="flex-1 text-sm font-medium break-words overflow-hidden"
              style={{ wordBreak: "break-word" }}
            >
              <span className="">{item.text}</span>
              {isSending && <small>(Saving...)</small>}
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-start gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 hover:scale-105 transition-colors duration-300 items-start"
              onClick={onEdit}
              disabled={isSending}
            >
              <FilePenIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 hover:scale-110 transition-colors duration-300 items-start"
              onClick={onDelete}
              disabled={isSending}
            >
              <TrashIcon className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
      <div className="item-end right-auto text-xs">
        {`Created: ${item.formatted_date}`}
      </div>
    </div>
  );
}
