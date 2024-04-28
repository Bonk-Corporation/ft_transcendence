with import <nixpkgs> {};

{ prod ? false }:

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

		tmux
	];

	shellHook = ''
		export "PATH=venv/bin/:$PATH"
		export PIP_DISABLE_PIP_VERSION_CHECK=1

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

		${if prod then
			''
				pnpm -C frontend build
				python3 backend/manage.py migrate bonk
				python3 backend/manage.py migrate
			''
		  else
			''
				tmux new-session -d make
				tmux set -g mouse on # neat
				tmux split-window -h 'make fdev'
				exec tmux attach
			''
		 }
	'';
}
