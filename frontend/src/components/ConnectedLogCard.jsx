import React from 'react';

export function ConnectedLogCard() {
  return (
    <div className="flex">
      <a href="/login">
        <button className="font-medium m-2 border-2 border-white rounded-full px-4 py-1 hover:bg-white hover:text-black transition-all ease-in-out">
          Log in
        </button>
      </a>
      <a href="/signin">
        <button className="font-medium m-2 rounded-full px-4 py-1 bg-white text-black hover:bg-gray-300 transition-all ease-in-out">
          Sign in
        </button>
      </a>
    </div>
  );
}
