debug: node_modules
	npm start

node_modules:
	npm install

test:
	npm test

clean:
	rm -rf build

deploy:
	npm run production:build
	aws s3 sync build/ s3://hottub-cohoecovillage-org/ --delete
	CLOUDFRONT_DISTRIBUTION_ID=E37GVCROE7A8K0 && \
	INVALIDATION_ID=`aws cloudfront create-invalidation --distribution-id $$CLOUDFRONT_DISTRIBUTION_ID \
		--paths /index.html | jq -r '.Invalidation.Id'` && \
	aws cloudfront wait invalidation-completed --distribution-id $$CLOUDFRONT_DISTRIBUTION_ID \
          --id $$INVALIDATION_ID

