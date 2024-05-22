import React from 'react';
import { Card } from '../../components/utils/Card';
import { Input } from '../../components/utils/Input';
import { CTA } from '../../components/utils/CTA';

export function Signup(props) {
	const username = React.useRef(null);
	const password = React.useRef(null);
	const confirmPassword = React.useRef(null);

	function handleSignup() {
		if (password.current.value != confirmPassword.current.value) {
			alert("password mismatch !");
			return;
		}

		fetch("/auth/register", {
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
		<Card className="py-32 w-full max-w-[800px] px-16 flex flex-col items-center justify-center">
			<div className="max-w-[600px] flex flex-col items-center justify-center">
				<h1 className="text-2xl font-semibold">Sign up</h1>
				<form action="" method="POST" className="w-full flex flex-col items-center">
					<Input className="my-1 w-full" ref={username} placeholder="Username" type="text"/>
					<Input className="my-1 w-full" ref={password} placeholder="Password" type="password"/>
					<Input className="my-1 w-full" ref={confirmPassword} placeholder="Confirm password" type="password"/>
				</form>
				<CTA onClick={() => {props.setTriedLog(true); handleSignup()}} className="my-2">Sign up</CTA>
			</div>
			<hr className="w-56 my-3" />
			<div className="flex flex-col items-center">
				<p className="text-sm mb-1">Already have an account ?</p>
				<a href="/"><CTA>Log in</CTA></a>
			</div>
		</Card>
	);
}
