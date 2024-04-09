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
		export PIP_DISABLE_PIP_VERSION_CHECK=1

		pnpm install --reporter=silent
		pnpm install -C frontend --reporter=silent

		make venv >/dev/null
		source venv/bin/activate

		pip3 install -r requirements.txt --quiet

		${if prod then "pnpm -C frontend build --reporter=silent" else ""}
	'';
}
