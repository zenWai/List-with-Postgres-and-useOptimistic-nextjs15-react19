"use client";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Something went wrong!</h2>
      <div>{error.message}</div>
      <button
        onClick={() => window.location.reload()}
        className="text-blue-600 underline"
      >
        Try again
      </button>
    </div>
  );
}
