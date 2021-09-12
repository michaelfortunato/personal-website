'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./prerender-manifest.json');
require('./manifest.json');
require('./routes-manifest.json');
var defaultHandler = require('./default-handler-1d169422.js');
require('perf_hooks');
require('stream');
require('zlib');
require('http');
require('buffer');
require('util');
require('crypto');



exports.handler = defaultHandler.handler;
