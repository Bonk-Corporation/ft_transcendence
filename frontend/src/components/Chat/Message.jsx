export function Message({ where, children }) {
  return (
    <div
      className={`${where == "local" ? "self-end" : "self-start"}
		m-1 max-w-32`}
    >
      {where == "distant" ? (
        <p className="text-xs mx-1 pl-6 overflow-hidden w-full text-ellipsis">
          {children.author}
        </p>
      ) : null}
      <div className="flex items-end">
        {where == "distant" ? (
          <div
            className={`mr-1 h-6 aspect-square rounded-full bg-[url(${children.avatar})] bg-center bg-cover group overflow-hidden`}
          >
            <div className="group-hover:flex hidden items-center justify-center w-full h-full bg-blue-500 font-semibold text-xs opacity-80">
              {children.level}
            </div>
          </div>
        ) : null}
        <div
          className={`${
            where == "local"
              ? "bg-gradient-to-br from-black/30 to-black/15"
              : "bg-gradient-to-br from-black/10 to-black/5"
          }
				p-1 max-w-32 rounded break-words`}
        >
          {children.content}
        </div>
      </div>
    </div>
  );
}
