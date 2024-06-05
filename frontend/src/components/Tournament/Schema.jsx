import React from "react";
import { useEffect, useState } from "preact/hooks";

export function Schema(props) {
  function getPhaseIdx(size) {
    if (size == 2) return 1;
    if (size == 4) return 2;
    if (size == 8) return 3;
  }

  const [phaseIndex, setPhaseIndex] = useState(1);

  useEffect(() => {
    if (props.room) setPhaseIndex(getPhaseIdx(props.room.size));
  }, [props.room]);
  return (
    <div className="h-full w-full flex flex-col justify-center">
      {(props.room?.size == 8 && props.room.phases.length == 4) ||
      (props.room?.size == 4 && props.room.phases.length == 3) ||
      (props.room?.size == 2 && props.room.phases.length == 2) ? (
        <div className="flex flex-col items-center">
          <i className="fa-solid fa-crown pb-1"></i>
          <div className="h-full flex justify-center">
            <div
              className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[phaseIndex]?.[0]?.avatar})]`}
            ></div>
          </div>
        </div>
      ) : null}
      {props.room?.size >= 2 ? (
        <>
          <div className="h-36 flex justify-center">
            <div className="rounded-t border-4 border-b-0 w-96"></div>
          </div>
          {(props.room?.size == 8 && props.room.phases.length >= 3) ||
          (props.room?.size == 4 && props.room.phases.length >= 2) ||
          (props.room?.size == 2 && props.room.phases.length >= 1) ? (
            <div className="flex justify-center">
              <div className="w-48 h-full flex justify-center pl-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[phaseIndex - 1]?.[0]?.avatar})]`}
                ></div>
              </div>
              <div className="w-48 h-full flex justify-center"></div>
              <div className="w-48 h-full flex justify-center pr-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[phaseIndex - 1]?.[1]?.avatar})]`}
                ></div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
      {props.room?.size >= 4 ? (
        <>
          <div className="h-36 flex justify-center">
            <div className="rounded-t border-4 border-b-0 w-48"></div>
            <div className="rounded-t w-48"></div>
            <div className="rounded-t border-4 border-b-0 w-48"></div>
          </div>
          {(props.room?.size == 8 && props.room.phases.length >= 2) ||
          (props.room?.size == 4 && props.room.phases.length >= 1) ? (
            <div className="flex justify-center">
              <div className="w-24 h-full flex justify-center pl-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[phaseIndex - 2]?.[0]?.avatar})]`}
                ></div>
              </div>
              <div className="w-24 h-full flex justify-center"></div>
              <div className="w-24 h-full flex justify-center pr-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[phaseIndex - 2]?.[1]?.avatar})]`}
                ></div>
              </div>
              <div className="w-24 h-full flex justify-center"></div>
              <div className="w-24 h-full flex justify-center pl-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[phaseIndex - 2]?.[2]?.avatar})]`}
                ></div>
              </div>
              <div className="w-24 h-full flex justify-center"></div>
              <div className="w-24 h-full flex justify-center pr-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[phaseIndex - 2]?.[3]?.avatar})]`}
                ></div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
      {props.room?.size == 8 ? (
        <>
          <div className="h-36 flex justify-center">
            <div className="rounded-t border-4 border-b-0 w-24 h-full"></div>
            <div className="rounded-t w-24 h-full"></div>
            <div className="rounded-t border-4 border-b-0 w-24 h-full"></div>
            <div className="rounded-t w-24 h-full"></div>
            <div className="rounded-t border-4 border-b-0 w-24 h-full"></div>
            <div className="rounded-t w-24 h-full"></div>
            <div className="rounded-t border-4 border-b-0 w-24 h-full"></div>
          </div>
          {props.room.phases.length >= 1 ? (
            <div className="flex justify-center">
              <div className="w-12 h-full flex justify-center pl-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[0]?.[0]?.avatar})]`}
                ></div>
              </div>
              <div className="w-12 h-full flex justify-center"></div>
              <div className="w-12 h-full flex justify-center pr-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[0]?.[1]?.avatar})]`}
                ></div>
              </div>
              <div className="w-12 h-full flex justify-center"></div>
              <div className="w-12 h-full flex justify-center pl-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[0]?.[2]?.avatar})]`}
                ></div>
              </div>
              <div className="w-12 h-full flex justify-center"></div>
              <div className="w-12 h-full flex justify-center pr-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[0]?.[3]?.avatar})]`}
                ></div>
              </div>
              <div className="w-12 h-full flex justify-center"></div>
              <div className="w-12 h-full flex justify-center pl-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[0]?.[4]?.avatar})]`}
                ></div>
              </div>
              <div className="w-12 h-full flex justify-center"></div>
              <div className="w-12 h-full flex justify-center pr-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[0]?.[5]?.avatar})]`}
                ></div>
              </div>
              <div className="w-12 h-full flex justify-center"></div>
              <div className="w-12 h-full flex justify-center pl-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[0]?.[6]?.avatar})]`}
                ></div>
              </div>
              <div className="w-12 h-full flex justify-center"></div>
              <div className="w-12 h-full flex justify-center pr-1">
                <div
                  className={`h-8 aspect-square rounded-full border-4 bg-center bg-cover bg-[url(${props.room.phases[0]?.[7]?.avatar})]`}
                ></div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
