VIRTUALENV = virtualenv
PYTHON = python3
PNPM = pnpm

run:
	$(PYTHON) backend/manage.py runserver 0.0.0.0:8000

fdev:
	$(PNPM) -C frontend run dev

venv:
	rm -rf $@
	$(VIRTUALENV) $@

.PHONY: run
