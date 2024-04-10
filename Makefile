VIRTUALENV = virtualenv
PYTHON = python3
PNPM = pnpm

run:
	$(PYTHON) backend/manage.py runserver

fdev:
	$(PNPM) -C frontend run dev

venv:
	[ -e $@ ] || $(VIRTUALENV) $@

.PHONY: run
