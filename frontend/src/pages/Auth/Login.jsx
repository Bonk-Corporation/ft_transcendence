const CLIENT_ID = document.querySelector("setting[name=CLIENT_ID]").textContent
const HOST = document.querySelector("setting[name=HOST]").textContent
document.querySelector("settings").remove()

export function Login() {
	const redirectUri = encodeURIComponent(`${location.protocol}//${HOST}`)
	const url = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}/auth/42&response_type=code`;

	return <div>
		<a href={url}>Log in with 42</a>
	</div>
}
