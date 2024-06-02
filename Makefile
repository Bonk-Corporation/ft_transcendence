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

bonk-server:
	sh backend/bonk-server/pkg/bonk-server.sh

.PHONY: run venv pong-server