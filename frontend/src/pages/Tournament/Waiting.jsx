import React, { useEffect, useState } from "react";
import { Card } from "../../components/utils/Card";

export function Waiting() {
  const [suspension, setSuspension] = useState(".");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSuspension((current) => {
        if (current != "...") return `${current}.`;
        else return ".";
      });
    }, 900);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="flex flex-col items-center py-4 px-8">
      <h1 className="text-xl font-semibold">Waiting{suspension}</h1>
      <p className="mb-4">All participants must complete their game !</p>
      <div role="status">
        <svg
          class="animate-spin -ml-1 mr-3 h-6 w-6 text-purple-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </Card>
  );
}
