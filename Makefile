install:
	npm --registry=http://npm-registry.napos.io --cache=/Users/eleme/.npm/.cache/nnpm --disturl=http://npm-registry.napos.io/dist install && bower install

start: install
	gulp
