VIRTUALENV = virtualenv
PYTHON = python3
PNPM = pnpm

run:
	$(PYTHON) backend/manage.py runserver 0.0.0.0:8001

fdev:
	$(PNPM) -C frontend run dev

pong-server:
	$(MAKE) -C backend/$@

venv:
	$(RM) -r $@
	$(VIRTUALENV) $@

bonk-rebuild:
	godot4 --display-driver headless --path backend/bonk-server --export-debug server $(PWD)/backend/bonk-server/pkg/bonk-server.x86-64
	godot4 --display-driver headless --path backend/bonk-server --export-debug Web $(PWD)/frontend/bonk-client/bonk-client.html
	gzip -f frontend/bonk-client/bonk-client.wasm
	gzip -f frontend/bonk-client/bonk-client.pck
	yes yes | python backend/manage.py collectstatic
	sh backend/bonk-server/pkg/bonk-server.sh

bonk-server:
	chmod +x backend/bonk-server/pkg/bonk-server.x86-64
	./backend/bonk-server/pkg/bonk-server.x86-64

.PHONY: run venv pong-server