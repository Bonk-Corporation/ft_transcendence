VIRTUALENV = virtualenv
PYTHON = python3

run:
	$(PYTHON) backend/manage.py runserver

venv:
	[ -e $@ ] || $(VIRTUALENV) $@

.PHONY: run
