import React from "react";

export function Schema(props) {
  return (
    <div className="h-full w-full flex flex-col justify-center">
      {props.room.size >= 2 ? (
        <div className="h-36 flex justify-center">
          <div className="rounded-t border-4 border-b-0 w-96"></div>
        </div>
      ) : null}
      {props.room.size >= 4 ? (
        <div className="h-36 flex justify-center">
          <div className="rounded-t border-4 border-b-0 w-48"></div>
          <div className="rounded-t w-48"></div>
          <div className="rounded-t border-4 border-b-0 w-48"></div>
        </div>
      ) : null}
      {props.room.size == 8 ? (
        <div className="h-36 flex justify-center">
          <div className="rounded-t border-4 border-b-0 w-24 h-full"></div>
          <div className="rounded-t w-24 h-full"></div>
          <div className="rounded-t border-4 border-b-0 w-24 h-full"></div>
          <div className="rounded-t w-24 h-full"></div>
          <div className="rounded-t border-4 border-b-0 w-24 h-full"></div>
          <div className="rounded-t w-24 h-full"></div>
          <div className="rounded-t border-4 border-b-0 w-24 h-full"></div>
        </div>
      ) : null}
    </div>
  );
}
