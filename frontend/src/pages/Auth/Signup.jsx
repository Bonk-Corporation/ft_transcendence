import React from 'react';
import { Card } from '../../components/utils/Card';
import { Input } from '../../components/utils/Input';
import { CTA } from '../../components/utils/CTA';

export function Signup() {
	const url = '/login';
	return (
		<Card className="py-32 w-full max-w-[800px] px-16 flex flex-col items-center justify-center">
			<div className="max-w-[600px] flex flex-col items-center justify-center">
				<h1 className="text-2xl font-semibold">Sign up</h1>
				<form action="" method="POST" className="w-full flex flex-col items-center">
					<Input className="my-1 w-full" placeholder="Username" type="text"/>
					<Input className="my-1 w-full" placeholder="Password" type="password"/>
					<Input className="my-1 w-full" placeholder="Confirm password" type="password"/>
				</form>
				<CTA className="my-2">Sign up</CTA>
				<a className="underline" href={url}>Sign up with 42</a>
			</div>
			<hr className="w-56 my-3" />
			<div className="flex flex-col items-center">
				<p className="text-sm mb-1">Already have an account ?</p>
				<a href="/"><CTA>Log in</CTA></a>
			</div>
		</Card>
	);
}
