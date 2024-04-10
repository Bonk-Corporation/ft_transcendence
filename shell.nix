with import <nixpkgs> {};

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
		pnpm install

		make venv
		source venv/bin/activate

		pip3 install -r requirements.txt
	'';
}
