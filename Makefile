VIRTUALENV = virtualenv
PYTHON = python3

run:
	@. venv/bin/activate && \
		$(PYTHON) backend/manage.py runserver;

venv:
	$(VIRTUALENV) $@

.PHONY: run
