with import <nixpkgs> {};

{ prod ? false }:

mkShell {
	packages = [
		python3
		virtualenv

		nodejs
		nodePackages.pnpm

		codespell
		nodePackages.prettier
		black
	];

	shellHook = ''
		pnpm install --reporter=silent
		pnpm install -C frontend --reporter=silent

		make venv
		source venv/bin/activate

		pip3 install -r requirements.txt --quiet

		${if prod then "pnpm -C frontend build" else ""}
	'';
}
