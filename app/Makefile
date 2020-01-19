debug: node_modules
	npm start

install:
	(cd ../react-ui-thermometer/ && npm install && ./node_modules/webpack-cli/bin/cli.js)
	npm install

test:
	npm test

clean:
	rm -rf build node_modules

deploy:
	npm run production:build
	aws s3 sync build/ s3://hottub-cohoecovillage-org/ --delete
	CLOUDFRONT_DISTRIBUTION_ID=E37GVCROE7A8K0 && \
	INVALIDATION_ID=`aws cloudfront create-invalidation --distribution-id $$CLOUDFRONT_DISTRIBUTION_ID \
		--paths /index.html | jq -r '.Invalidation.Id'` && \
	aws cloudfront wait invalidation-completed --distribution-id $$CLOUDFRONT_DISTRIBUTION_ID \
          --id $$INVALIDATION_ID

