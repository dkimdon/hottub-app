VERSION:=$(shell date +%s)
S3BUCKET=coho-bwa-console
S3PATH=devel
S3KEY=bwa-console-lambda/$(S3PATH)/bwa-console-lambda-$(VERSION).zip

zip: bwa-console-lambda-$(VERSION).zip

bwa-console-lambda-$(VERSION).zip: index.js
	rm -rf node_modules
	npm install --only=production
	zip -q -r bwa-console-lambda-$(VERSION).zip lib/* node_modules/* package.json index.js

upload: zip
	aws s3 cp bwa-console-lambda-$(VERSION).zip s3://$(S3BUCKET)/api/$(S3PATH)/bwa-console-lambda-$(VERSION).zip
	rm -f bwa-console-lambda-$(VERSION).zip

install:
	npm install

clean:
	rm -rf node_modules coverage reports

test: COMMAND=$(TEST_SETUP) ./node_modules/mocha/bin/mocha --ui bdd -R spec --recursive

cover: COMMAND= ./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha -- --ui bdd -R spec --recursive


test cover:
	$(COMMAND)

beautify:
	find lib/ test/ -type f | xargs js-beautify -r

.PHONY: test

