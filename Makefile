VIRTUALENV = virtualenv
PYTHON = python3

run:
	$(PYTHON) backend/manage.py runserver

venv:
	$(VIRTUALENV) $@

.PHONY: run
