.PHONY: help publish

help:
	@echo 'Targets:'
	@echo '  publish:   publish files on the website'

publish:
	rsync --archive --verbose --exclude='.git' --exclude='Makefile' ./ eggtimer.org:public_html/eggtimer/
