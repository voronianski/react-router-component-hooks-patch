var jsdom = require('jsdom').jsdom;

global.chai = require('chai');
global.sinon = require('sinon');
global.expect = global.chai.expect;

global.document = jsdom('');
global.window = document.defaultView;
global.navigator = {userAgent: 'node.js'};
