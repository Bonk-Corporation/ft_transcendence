VIRTUALENV = virtualenv
PYTHON = python3
PNPM = pnpm

run:
	(cd backend && daphne bonk.asgi:application --port 8000 --bind 0.0.0.0)

fdev:
	$(PNPM) -C frontend run dev

venv:
	$(RM) -r $@
	$(VIRTUALENV) $@

.PHONY: run
