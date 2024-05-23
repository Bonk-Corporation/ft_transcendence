export function Message({ where, children }) {
	return (
		<button class={`${where == "local"
			? "bg-gradient-to-br from-black/30 to-black/15 self-end"
			: "bg-gradient-to-br from-black/10 to-black/5 self-start"}
			m-1 p-1 rounded w-32 break-words`}>
			{ children }
		</button>
	)
}
