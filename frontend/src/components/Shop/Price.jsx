import React from "react";

export function Price({ price }) {
  return (
    <div className="flex bg-white px-1.5 py-0.5 rounded w-fit">
      <h1 className="text-black font-medium mr-1">{price}</h1>
      <h1 className="bg-black rounded-full aspect-square w-6 flex justify-center items-center font-medium text-sm">
        B
      </h1>
    </div>
  );
}
