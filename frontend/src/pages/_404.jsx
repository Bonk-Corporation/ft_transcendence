import { language } from "../scripts/languages";

export function NotFound({lang}) {
	return (
		<section>
			<h1>404: Not Found</h1>
			<p>{language.not_found[lang]}</p>
		</section>
	);
}
