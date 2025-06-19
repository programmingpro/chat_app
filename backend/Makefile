# Makefile для работы с PostgreSQL (автоматическое чтение .env)

# Включаем переменные из .env
include .env
export $(shell sed 's/=.*//' .env)

DUMP_FILE = dump/dump.sql

.PHONY: apply-dump create-dump check-env

apply-dump: check-env
	@echo "Applying database dump..."
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql \
		-U $(POSTGRES_USER) \
		-h $(POSTGRES_HOST) \
		-p $(POSTGRES_PORT) \
		-d $(POSTGRES_DB) \
		-f $(DUMP_FILE)
	@echo "Dump applied successfully!"

create-dump: check-env
	@echo "Creating database dump..."
	@mkdir -p dump
	@PGPASSWORD=$(POSTGRES_PASSWORD) pg_dump \
		-U $(POSTGRES_USER) \
		-h $(POSTGRES_HOST) \
		-p $(POSTGRES_PORT) \
		-d $(POSTGRES_DB) \
		-F p \
		-f $(DUMP_FILE)
	@echo "Dump created at $(DUMP_FILE)"

check-env:
	@if [ -z "$(POSTGRES_PASSWORD)" ] || [ -z "$(POSTGRES_USER)" ] || [ -z "$(POSTGRES_DB)" ]; then \
		echo "Error: Missing database configuration in .env file"; \
		exit 1; \
	fi

# Дополнительные полезные команды
create-db: check-env
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql \
		-U $(POSTGRES_USER) \
		-h $(POSTGRES_HOST) \
		-p $(POSTGRES_PORT) \
		-c "CREATE DATABASE $(POSTGRES_DB);"

drop-db: check-env
	@PGPASSWORD=$(POSTGRES_PASSWORD) psql \
		-U $(POSTGRES_USER) \
		-h $(POSTGRES_HOST) \
		-p $(POSTGRES_PORT) \
		-c "DROP DATABASE IF EXISTS $(POSTGRES_DB);"

reset-db: drop-db create-db apply-dump