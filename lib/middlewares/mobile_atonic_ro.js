'use strict';

var interceptor = require('express-interceptor');

module.exports = interceptor(function(req, res) {
	return {
		// Only HTML responses will be intercepted
		isInterceptable: function() {
			return res.locals.currentCulture && res.locals.currentCulture.language === 'ro' && /text\/html/.test(res.get('Content-Type'));
		},
		// Appends a paragraph at the end of the response body
		intercept: function(body, send) {
			send(body.replace(/ș/g, 's').replace(/Ș/g, 'S').replace(/ț/g, 't').replace(/Ț/g, 't').replace(/[ăâ]/g, 'a').replace(/[ĂÂ]/g, 'A').replace(/î/g, 'i').replace(/Î/g, 'I'));
		}
	};
});
