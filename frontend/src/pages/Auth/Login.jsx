import React from 'react';
import { Card } from '../../components/utils/Card'
import { Input } from '../../components/utils/Input';
import { CTA } from '../../components/utils/CTA';
import { useEffect } from 'preact/hooks';

const CLIENT_ID = document.querySelector("setting[name=CLIENT_ID]").textContent
const HOST = document.querySelector("setting[name=HOST]").textContent
document.querySelector("settings").remove()

export function Login(props) {
	const redirectUri = encodeURIComponent(`${location.protocol}//${HOST}`)
	const url = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}/auth/42&response_type=code`;

	const username = React.useRef(null);
	const password = React.useRef(null);

	function handleLogin() {
		fetch("/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"username": username.current.value,
				"password": password.current.value
			}),
		}).then(res => res.json()
			.then(data => {
				if (data.success)
					window.location.pathname = "/play";
			}));
	}

	return (
		<Card className="py-28 w-full max-w-[800px] px-16 flex flex-col items-center justify-center">
			<div className="max-w-[600px] flex flex-col items-center justify-center">
				<h1 className="text-2xl font-semibold">Log in</h1>
				<form action="" method="POST" className="w-full flex flex-col items-center">
					<Input className="my-1 w-full" ref={username} placeholder="Username" type="text"/>
					<Input className="my-1 w-full" ref={password} placeholder="Password" type="password"/>
				</form>
				<CTA onClick={() => {props.setTriedLog(true); handleLogin()}} className="my-2">Log in</CTA>
				<a onClick={() => props.setTriedLog(true)} className="underline" href={url}>Log in with 42</a>
			</div>
			<hr className="w-56 my-3" />
			<div className="flex flex-col items-center">
				<p className="text-sm mb-1">No account yet ?</p>
				<a href="/signup"><CTA>Sign up</CTA></a>
			</div>
		</Card>
	);
}
