SHELL := /bin/bash
HUGO := hugo

.PHONY: build-production build-prod prod
build-prod: build-production
prod: build-production
build-production:
	HUGO_ENV=production $(HUGO) --minify

.PHONY: build
build:
	$(HUGO)

.PHONY: serve
serve:
	$(HUGO) serve

.PHONY: deploy
deploy:
	rclone sync --config scripts/travis.rclone.conf ./public deploy:openiasscoreboard
