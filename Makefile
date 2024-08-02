.PHONY: start stop

install:
	npm install

start:
	docker compose up -d

stop:
	docker compose down

test:
	npm run test

coverage:
	npm run test:cov
