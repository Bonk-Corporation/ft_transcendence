with import <nixpkgs> {};

{
	prod ? false,
	should-start ? "transcendence"
}:

let
	fenix = import (fetchTarball "https://github.com/nix-community/fenix/archive/main.tar.gz") { };
	commonDeps = [
		# rust
		(with fenix; with latest; combine [
			minimal.toolchain
			targets.wasm32-unknown-unknown.latest.rust-std
		])
		wasm-pack
	];
	transcendenceDeps = lib.optional (should-start == "transcendence") [
		python3
		python3Packages.pip
		virtualenv
		gnused

		caddy

		nodejs
		nodePackages.pnpm

		postgresql
		pkgs.glibcLocales
	];
	pongDeps = lib.optional (!prod) [
		codespell
		nodePackages.prettier
		gdtoolkit
		black

		tmux
	];
in

mkShell {
	packages = commonDeps ++ transcendenceDeps ++ pongDeps;

	shellHook = ''
		should_start="${should-start}"

		case "$should_start" in
			pong-server)
				make pong-server
				;;
			transcendence)
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
				;;
			*)
				echo invalid --arg should-start value >&2
				exit 1
				;;
		esac
	'';
}
