#!/usr/bin/env node

var fiblog = require('../');

console.log(__filename);

var blogpath = process.env.blog || process.cwd();

console.log("blogpath: " + blogpath);

fiblog.start(blogpath);
