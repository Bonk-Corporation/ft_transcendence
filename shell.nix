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

		nodejs
		nodePackages.pnpm

		codespell
		nodePackages.prettier
		black

		postgresql
		pkgs.glibcLocales

		tmux
		
		(with fenix; with latest; combine [
			minimal.toolchain
			targets.wasm32-unknown-unknown.latest.rust-std
		])
	];

	shellHook = ''
		set -o allexport
		source .env
		set +o allexport

		export SHELL=zsh
		export PS1="[1mBonk Corporation[0m %% "
		export "PATH=venv/bin/:$PATH"
		export PIP_DISABLE_PIP_VERSION_CHECK=1
		export NIX_IGNORE_SYMLINK_STORE=1
		export NIX_ENFORCE_PURITY=0
		export PGDATA="backend/.pg"
		export NIX_IGNORE_SYMLINK_STORE=1
		export NIX_ENFORCE_PURITY=0
		export TERM=xterm

		cargo install wasm-pack

		initdb 2>/dev/null
		pg_ctl -o "-k /tmp" -l backend/pg.log start
		createdb -h /tmp "$DB_NAME" 2>/dev/null
		psql -h /tmp -c "
			CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
			GRANT ALL ON DATABASE $DB_NAME TO $DB_USER;
			ALTER DATABASE $DB_NAME OWNER TO $DB_USER;" \
			"$DB_NAME"

		yes | pnpm install --reporter=silent
		yes | pnpm install -C frontend --reporter=silent

		make venv >/dev/null
		${if prod then
			''
				sed -i '1s|.*|#!/app/venv/bin/python3|' venv/bin/pip3
			''
		  else
			''
				sed -i "1s|.*|#!$PWD/venv/bin/python3|" venv/bin/pip3
			''
		}
		source venv/bin/activate

		pip3 install -r requirements.txt --break-system-packages --quiet

		if [ ! -e .initial_migration_done ]; then
			python3 backend/manage.py migrate
			touch .initial_migration_done
		fi

		${if prod then
			''
				sed -i '/FT_DEBUG/d' .env
				echo FT_DEBUG=n >> .env

				pnpm -C frontend build
			''
		  else
			''
				# install git commit hooks
				pnpx husky install >/dev/null 2>&1

				sed -i '/FT_DEBUG/d' .env
				echo FT_DEBUG=y >> .env

				tmux new-session -d 'trap : INT; make || $SHELL'
				tmux set -g mouse on # neat
				tmux split-window -h 'trap : INT; make fdev || $SHELL'
				tmux split-window '$SHELL'
				tmux attach
			''
		 }
		pg_ctl stop
		exit
	'';
}
