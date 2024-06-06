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

		# kil me pls
		postgresql
		pkgs.glibcLocales

		python3
		python3Packages.pip
		virtualenv
		gnused

		glibc
	];
	transcendenceDeps = lib.optional (should-start == "transcendence") [
		caddy

		nodejs
		nodePackages.pnpm

		openssh
	];
	pongDeps = lib.optional (should-start == "pong-server") [
		# hmmm
	];
	bonkDeps = lib.optional (should-start == "bonk-server") [
		wget
		godot_4
	];
	nonProdDeps = lib.optional (!prod) [
		codespell
		nodePackages.prettier
		gdtoolkit
		black
		tmux
		wget
		godot_4
	];
in

mkShell {
	packages = commonDeps ++ transcendenceDeps ++ pongDeps ++ bonkDeps ++ nonProdDeps;

	nativeBuildInputs = [ pkgs.pkg-config ];
	LD_LIBRARY_PATH = lib.makeLibraryPath [ openssl ];
	buildInputs = [ pkgs.openssl ];

	shellHook = ''
		should_start="${should-start}"

		case "$should_start" in
			pong-server|bonk-server)
				for script in startup.d/02-source_env startup.d/03-env startup.d/09-debug; do
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

				if [ "$should_start" = bonk-server ]; then
					source startup.d/06-venv true
					source startup.d/12-bonk false
				fi

				make "$should_start"
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
