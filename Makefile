.PHONY: build preview

build:
	npx tsc

preview: build
	PULUMI_CONFIG_PASSPHRASE="" pulumi preview
