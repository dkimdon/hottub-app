install:
	npm install

clean:
	rm -rf node_modules coverage reports

test:
	./node_modules/mocha/bin/mocha --ui bdd -R spec --recursive

cover:
	./node_modules/nyc/bin/nyc.js --reporter=lcov make test
	echo "Coverage report created in: coverage/lcov-report/index.html"

beautify:
	find lib/ test/ -type f | xargs js-beautify -r

.PHONY: test

