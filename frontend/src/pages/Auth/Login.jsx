import React from 'react';
import { Card } from '../../components/utils/Card'
import { Input } from '../../components/utils/Input';
import { CTA } from '../../components/utils/CTA';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { language } from '../../scripts/languages';

const CLIENT_ID = document.querySelector("setting[name=CLIENT_ID]").textContent
const HOST = document.querySelector("setting[name=HOST]").textContent
document.querySelector("settings").remove()

export function Login(props) {
	const redirectUri = encodeURIComponent(`${location.protocol}//${HOST}`)
	const url = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}/auth/42&response_type=code`;

	const username = useRef(null);
	const password = useRef(null);

	const [error, setError] = useState("");

	function handleLogin() {
		props.setTriedLog(true);
		fetch("/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"username": username.current.value,
				"password": password.current.value
			}),
		}).then(res => {
			if (!res.ok) {
				return res.json().then(errData => {
					throw new Error(errData.error)})
			}
		}).then(data => {
			window.location.pathname = "/play";
		}).catch(err => {
			setError(err.message);
			username.current.value = "";
			password.current.value = "";
		});
	}

	function enter(e) {
		if (e.key == 'Enter')
			handleLogin();
	}

	return (
		<Card className="py-28 w-full max-w-[800px] px-16 flex flex-col items-center justify-center">
			<div className="max-w-[600px] flex flex-col items-center justify-center">
				<h1 className="text-2xl font-semibold">{language.log_in[props.lang]}</h1>
				<form onKeyPress={enter} action="" method="POST" className="w-full flex flex-col items-center">
					<Input className="my-1 w-full" ref={username} placeholder={language.username[props.lang]} type="text"/>
					<Input className="my-1 w-full" ref={password} placeholder={language.password[props.lang]} type="password"/>
					<p className="mb-2 text-sm text-red-500">{error}</p>
				</form>
				<CTA onClick={handleLogin} className="my-2">{language.log_in[props.lang]}</CTA>
				<a onClick={() => props.setTriedLog(true)} className="underline" href={url}>{language.log_in_42[props.lang]}</a>
			</div>
			<hr className="w-56 my-3" />
			<div className="flex flex-col items-center">
				<p className="text-sm mb-1">{language.no_account[props.lang]}</p>
				<a href="/signup"><CTA>{language.sign_up[props.lang]}</CTA></a>
			</div>
		</Card>
	);
}
