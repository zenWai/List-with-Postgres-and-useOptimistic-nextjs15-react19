"use client";

import React, { useState, useEffect} from "react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";

export function SortSelect({
  onSort,
}: {
  onSort: (sortByTerm: { sortByTerm: string }) => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [sortByTerm, setSortByTerm] = useState(
    searchParams.get("sortBy") || "",
  );

  useEffect(() => {
    onSort({ sortByTerm });
  }, [sortByTerm, onSort]);

  const handleSortBy = (value: string) => {
    setSortByTerm(value);
    updateSearchParams("sortBy", value);
  };

  const createUrl = (
    pathname: string,
    params: URLSearchParams | ReadonlyURLSearchParams,
  ) => {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

    return `${pathname}${queryString}`;
  };

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  // useCallback probably not necessary since we are in react 19
  const updateSearchParams =
    (name: string, value: string) => {
      //console.log("hi from updatesearch")
      const originalSearchParams = new URLSearchParams(searchParams.toString());
      originalSearchParams.set(name, value);
      const newUrl = createUrl(pathname, originalSearchParams);
      window.history.replaceState(null, "", newUrl);
      {
        /* router.push simplify and causes a page revalidation
         * No need for createUrl for example
         * Creates a revalidation tho and changes searchParams on a debounce
         */
      }
      //router.push(`?${params.toString()}`, {scroll:false});
    }

  return (
    <div className="flex flex-col gap-6 p-6 bg-background rounded-b-lg shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="sort-by"
              className="block mb-2 text-sm font-medium text-foreground"
            >
              Sort by:
            </label>
            <Select value={sortByTerm} onValueChange={handleSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Default: Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by Date</SelectLabel>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Sort by Name</SelectLabel>
                  <SelectItem value="a-z">A-Z</SelectItem>
                  <SelectItem value="z-a">Z-A</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
