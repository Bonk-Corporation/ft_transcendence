import { useContext } from "preact/hooks";
import { LangContext } from "../Contexts";
import { language } from "../scripts/languages";

export function NotFound() {
	const lang = useContext(LangContext);
	return (
		<section>
			<h1>404: Not Found</h1>
			<p>{language.not_found[lang]}</p>
		</section>
	);
}
