import React from 'react';


export function NotLogCard() {
  return (
    <div className="flex items-center pr-4">
      <a href="/login">
        <button className="font-medium mx-2 border-2 border-white rounded-full px-6 py-2 hover:bg-white hover:text-black transition-all ease-in-out">
          Log in
        </button>
      </a>
      <a href="/signin">
        <button className="font-medium mx-2 border-2 border-white rounded-full px-6 py-2 bg-white text-black hover:bg-gray-300 hover:border-gray-300 transition-all ease-in-out">
          Sign in
        </button>
      </a>
    </div>
  );
}
