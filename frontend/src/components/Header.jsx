import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					Home
				</a>
				<a href="/404" class={url == '/404' && 'active'}>
					404
				</a>
				<a href="/login" class={url == '/login' && 'active'}>
					Login
				</a>
				<a href="/ws/chat/" class={url == '/ws/chat/' && 'active'}>
					Chat
				</a>

			</nav>
		</header>
	);
}
