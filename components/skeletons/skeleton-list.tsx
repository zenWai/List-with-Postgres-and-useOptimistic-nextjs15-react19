import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FilePenIcon } from "@/components/ui/icons/file-pen-icon";
import { TrashIcon } from "@/components/ui/icons/trash-icon";
import { Input } from "@/components/ui/input";
import Spinner from "./spinner";

const fakeItems = Array.from({ length: 9 }, (_, i) => ({ id: i + 1 }));

const ItemSkeleton = () => {
  return (
    <div
      className={`group flex flex-col items-start gap-2 rounded-lg border bg-background p-4 transition-colors duration-300 h-full`}
    >
      <div className={`flex w-full items-start justify-between animate-pulse`}>
        <div className="flex items-start gap-2 flex-1">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback>
              <Spinner />
            </AvatarFallback>
          </Avatar>
          <div
            className="flex-1 text-sm font-medium break-words overflow-hidden"
            style={{ wordBreak: "break-word" }}
          >
            <div className="bg-gray-300 rounded h-4 w-full"></div>
          </div>
        </div>
        <div className="flex items-start gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="transition-colors duration-300 items-start"
            disabled
          >
            <FilePenIcon className="h-6 w-6 text-gray-300" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="transition-colors duration-300 items-start"
            disabled
          >
            <TrashIcon className="h-6 w-6 text-gray-300" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default function SkeletonList() {
  return (
    <div className="flex flex-col gap-8 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Hello User</h1>
          <h2>Server has an artificial delay of 2 seconds</h2>
          <p>{`await new Promise((res) => setTimeout(res, 2000)); on top of every action`}</p>
          <p>Enjoy the lag!</p>
        </div>

        <div className="flex items-center gap-4">
          <form className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Add new item"
              className="max-w-[200px] sm:max-w-[300px] transition-colors duration-300 focus:bg-muted"
              disabled={true}
            />
            <Button
              size="sm"
              className="transition-colors duration-300"
              disabled={true}
            >
              Add
            </Button>
          </form>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-min">
        {fakeItems.map((item, index) => (
          <ItemSkeleton key={item.id} />
        ))}
      </div>
    </div>
  );
}
