'use strict';

var path = require('path');

module.exports = require('viewdata')(path.join(__dirname, './repository/*.js'));
