install:
	npm ci

start:
	npm start

build:
	npm run build

test:
	npm test

lint:
	npx eslint .

.PHONY: install start build test lint