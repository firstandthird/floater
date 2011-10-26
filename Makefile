boosh:
	git submodule update --init
	smoosh make ./build.json

clean:
	rm -rf dist
# requires npm >= 1.0.0
install:
	npm install smoosh -g
