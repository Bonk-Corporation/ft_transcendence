with import <nixpkgs> {};

{ prod ? false }:

let
	fenix = import (fetchTarball "https://github.com/nix-community/fenix/archive/main.tar.gz") { };
in

mkShell {
	packages = [
		python3
		python3Packages.pip
		virtualenv
		gnused

		caddy

		nodejs
		nodePackages.pnpm

		codespell
		nodePackages.prettier
		gdtoolkit
		black

		postgresql
		pkgs.glibcLocales

		tmux

		# rust
		(with fenix; with latest; combine [
			minimal.toolchain
			targets.wasm32-unknown-unknown.latest.rust-std
		])
		wasm-pack
	];

	shellHook = ''
		for script in startup.d/*; do
			echo sourcing $script...
			${if prod then
				''
				source "$script" true
				''
			else
				''
				source "$script" false
				''
			 }
		done
	'';
}
