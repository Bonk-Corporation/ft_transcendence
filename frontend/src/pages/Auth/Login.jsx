import { Card } from '../../components/Card'
import { Input } from '../../components/Input';
import { CTA } from '../../components/CTA';

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
					<Input className="my-1 w-full" placeholder="Username" type="text"/>
					<Input className="my-1 w-full" placeholder="Password" type="password"/>
				</form>
				<CTA className="my-2">Log in</CTA>
				<a className="underline" href={url}>Log in with 42</a>
			</div>
		</Card>
	);
}
