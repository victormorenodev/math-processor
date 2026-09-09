SHELL := /bin/bash

BACKEND_DIR := backend
FRONTEND_DIR := frontend
VENV := $(BACKEND_DIR)/venv

.PHONY: setup backend frontend dev clean

setup: $(VENV)/bin/activate $(FRONTEND_DIR)/node_modules

$(VENV)/bin/activate:
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install -r $(BACKEND_DIR)/requirements.txt

$(FRONTEND_DIR)/node_modules: $(FRONTEND_DIR)/package.json
	cd $(FRONTEND_DIR) && npm install
	touch $(FRONTEND_DIR)/node_modules

backend: $(VENV)/bin/activate
	cd $(BACKEND_DIR) && venv/bin/uvicorn app.main:app --reload

frontend: $(FRONTEND_DIR)/node_modules
	cd $(FRONTEND_DIR) && npm run dev

dev: setup
	@trap 'kill 0' SIGINT SIGTERM EXIT; \
	$(MAKE) backend & \
	$(MAKE) frontend & \
	wait

clean:
	rm -rf $(VENV) $(FRONTEND_DIR)/node_modules
