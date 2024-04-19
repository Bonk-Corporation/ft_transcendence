import { Card } from '../../components/Card'

// const CLIENT_ID = document.querySelector("setting[name=CLIENT_ID]").textContent
// const HOST = document.querySelector("setting[name=HOST]").textContent
// document.querySelector("settings").remove()

export function Login() {
	// const redirectUri = encodeURIComponent(`${location.protocol}//${HOST}`)
	// const url = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}/auth/42&response_type=code`;

	const url = '/login';
	return (
		<Card className="py-32 w-full max-w-[800px] px-16 flex flex-col items-center justify-center">
			<div className="max-w-[600px] flex flex-col items-center justify-center">
				<h1 className="text-2xl font-semibold">Log in</h1>
				<form action="" method="POST" className="w-full flex flex-col items-center">
					<input className="bg-transparent border-white border-2 rounded-lg my-1 w-full px-2 py-1" placeholder="Username" type="text" />
					<input className="bg-transparent border-white border-2 rounded-lg my-1 w-full px-2 py-1" placeholder="Password" type="password" />
				</form>
				<button className="px-6 py-2 bg-white rounded-lg text-black font-medium my-2 hover:bg-gray-300 transition-all ease-in-out">
					Log in
				</button>
				<a className="underline" href={url}>Log in with 42</a>
			</div>
		</Card>
	);
}
