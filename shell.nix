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

		tmux
	];

	shellHook = ''
		export PIP_DISABLE_PIP_VERSION_CHECK=1

		pnpm install --reporter=silent
		pnpm install -C frontend --reporter=silent

		make venv >/dev/null
		source venv/bin/activate

		pip3 install -r requirements.txt --quiet

		${if prod then
			''
				pnpm -C frontend build --reporter=silent
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
