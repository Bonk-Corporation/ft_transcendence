import { useLocation } from 'preact-iso';
import { LogCard } from './LogCard';
import { language } from '../../scripts/languages';
import init, { stop } from 'pong-client';
import { useContext, useEffect, useState } from 'preact/hooks';
import { ProfileContext, LangContext } from '../../Contexts';


export function Navbar(props) {
	const location = useLocation();
	const logged = true;

	const profile = useContext(ProfileContext);
	const lang = useContext(LangContext);

	const AUTHORIZED_LOCATIONS = ["/play", "/tournament", "/shop", "/profile", "/legal-notice", "/tournament/room"];
	const LOG_LOCATIONS = ["/", "/signup"];
	const [showLegalNotice, setShowLegalNotice] = useState(false);

	useEffect(() => {
		if (!LOG_LOCATIONS.includes(location.url) && props.triedLog && profile && profile.error && location.url) {
			location.route('/');
		}
		// why the fuck is it the navbar managing the redirects?????????????
		if (LOG_LOCATIONS.includes(location.url) && profile)
			location.route("/play");

		if (location.url != '/pong') {
			init().then(stop);
		}
	}, [profile, location, props.triedLog]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (!LOG_LOCATIONS.includes(location.url))
				fetch("/api/ping");
		}, 60000);
		return () => clearInterval(intervalId);
	}, [])

	return (
		<>
			<header className={`
				${AUTHORIZED_LOCATIONS.includes(location.url) ? "" : "hidden"}
				w-full pl-8 pr-4 py-4 z-50 mb-8
				flex justify-between items-center rounded-full
				angle-gradient border-gradient nav font-semibold transition-all backdrop-blur-lg
				`}
				onClick={() => setShowLegalNotice(!showLegalNotice)}
				>
				<a href={window.screen.width < 768 ? '/shop' : '/play'}>
					<svg width="80" height="36" viewBox="0 0 95 36" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M22.0945 11.7447C22.0945 17.6921 17.2732 22.5134 11.3258 22.5134C9.79429 22.5134 8.33743 22.1937 7.01835 21.6174V35.4359H0.557129V11.7447C0.557129 5.79732 5.37844 0.976013 11.3258 0.976013C17.2732 0.976013 22.0945 5.79732 22.0945 11.7447ZM7.01835 11.7447C7.01835 14.1237 8.94687 16.0522 11.3258 16.0522C13.7048 16.0522 15.6333 14.1237 15.6333 11.7447C15.6333 9.36576 13.7048 7.43723 11.3258 7.43723C8.94687 7.43723 7.01835 9.36576 7.01835 11.7447Z" fill="white"/>
						<path fill-rule="evenodd" clip-rule="evenodd" d="M42.7632 24.6672C42.7632 30.6146 37.9419 35.4359 31.9945 35.4359C26.0471 35.4359 21.2258 30.6146 21.2258 24.6672C21.2258 18.7198 26.0471 13.8985 31.9945 13.8985C37.9419 13.8985 42.7632 18.7198 42.7632 24.6672ZM36.302 24.6672C36.302 27.0461 34.3735 28.9746 31.9945 28.9746C29.6156 28.9746 27.687 27.0461 27.687 24.6672C27.687 22.2882 29.6156 20.3597 31.9945 20.3597C34.3735 20.3597 36.302 22.2882 36.302 24.6672Z" fill="white"/>
						<path d="M44.917 24.6672V35.4359H51.3782V24.6672C51.3782 22.2882 53.3067 20.3597 55.6857 20.3597C58.0646 20.3597 59.9932 22.2882 59.9932 24.6672V35.4359H66.4544V24.6672C66.4544 18.7198 61.6331 13.8985 55.6857 13.8985C49.7383 13.8985 44.917 18.7198 44.917 24.6672Z" fill="white"/>
						<path d="M91.2225 35.4358C93.0067 35.4358 94.4531 33.9895 94.4531 32.2052C94.4531 30.421 93.0067 28.9746 91.2225 28.9746C89.4382 28.9746 87.9918 30.421 87.9918 32.2052C87.9918 33.9895 89.4382 35.4358 91.2225 35.4358Z" fill="white"/>
						<path d="M87.9918 7.43726H94.453V26.8209H87.9918V7.43726Z" fill="white"/>
						<path d="M68.6082 7.43726H75.0694V18.2049C77.0341 15.5899 80.1617 13.8985 83.6843 13.8985H85.8381V20.3597H83.6843C81.3054 20.3597 79.3769 22.2882 79.3769 24.6672C79.3769 27.0461 81.3054 28.9747 83.6843 28.9747H85.8381V35.4359H83.6843C80.1617 35.4359 77.0341 33.7445 75.0694 31.1294V35.4359H68.6082V7.43726Z" fill="white"/>
					</svg>
				</a>

				<nav className="md:flex hidden">
					<a href="/tournament" className={`mx-10 text-xl text-shadow ${location.url == '/tournament' ? "text-white font-semibold" : "text-white/40 font-normal"} transition-all hover:text-white`}>
						{language.tournament[lang]}
					</a>
					<a href="/play" className={`mx-10 text-xl text-shadow ${location.url == '/play' ? "text-white font-semibold" : "text-white/40 font-normal"} transition-all hover:text-white`}>
						{language.play[lang]}
					</a>
					<a href="/shop" className={`mx-10 text-xl text-shadow ${location.url == '/shop' ? "text-white font-semibold" : "text-white/40 font-normal"} transition-all hover:text-white`}>
						{language.shop[lang]}
					</a>
				</nav>
				
				{logged ? <LogCard /> : null}
			</header>
			<p className={`${AUTHORIZED_LOCATIONS.includes(location.url) ? "" : "hidden"} ${showLegalNotice ? "flex" : "hidden"} min-[1343px]:flex absolute top-2 min-[1343px]:bottom-2 min-[1343px]:top-auto text-sm z-50`}>
				{AUTHORIZED_LOCATIONS.includes(location.url) ?
				<>
					<a href="/legal-notice" className="hover:underline cursor-pointer mx-1">
						{language.legal_notice[lang]}
					</a>
					· PonkCorp 2024 |
				</> : null
				}
				<div onClick={() => props.setLang('br')} className={`ml-2 ${lang == 'br' ? "border-2" : "" } w-5 h-5 rounded-full cursor-pointer bg-[url(https://upload.wikimedia.org/wikipedia/commons/c/c8/Gwenn_ha_Du_%2811_mouchetures%29.svg)] bg-center bg-cover`}></div>
				<div onClick={() => props.setLang('en')} className={`ml-2 ${lang == 'en' ? "border-2" : "" } w-5 h-5 rounded-full cursor-pointer bg-[url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1200px-Flag_of_the_United_Kingdom_%283-5%29.svg.png)] bg-center bg-cover`}></div>
				<div onClick={() => props.setLang('fr')} className={`ml-2 ${lang == 'fr' ? "border-2" : "" } w-5 h-5 rounded-full cursor-pointer bg-[url(https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/255px-Flag_of_France.svg.png)] bg-center bg-cover`}></div>
			</p>
		</>
	);
}
