;(function(window, angular) {

	'use strict';

  // Application counter module
  angular.module('app.counter', [
    'app.common'
  ])

  // Counter factory
  .factory('counter', [
    '$timeout',
		'util',
    ($timeout, util) => {

			// Define options
			let options = null;

			// Set private methods
			let methods = {

				// Set options
				options: (args) => {

					// Create promise
					return new Promise((resolve) => {

						// Check/Convert arguments
          	if (util.isString(args)) args = {skeleton: args};

						// Merge with default
          	options = util.objMerge({
          	  skeleton: '.counter',
          	  dataset	: 'total',
							regex 	: null,
							duration: 2000,
							delay 	: 0
          	}, args, true);

						// Check skeleton
          	if (!util.isString(options.skeleton) ||
          	    !(options.skeleton = options.skeleton.trim()).length)
							options.skeleton = '.counter';

						// Check dataset name
          	if (!util.isString(options.dataset) ||
          	    !(options.dataset = options.dataset.trim()).length)
							options.dataset = 'total';

						// Check regex
          	if (!util.isString(options.regex) ||
          	    !(options.regex = options.regex.trim()).length)
							options.regex = /(\d{1,3})(\d{3}(?:,|$))/;

						// Check duration
          	if (util.isString(options.duration) &&
								isNaN((options.duration = parseInt(options.duration))))
							options.duration = 2000;
						if (!util.isInt(options.duration) ||
								options.duration <= 0)
							options.duration = 2000;

						// Check delay
          	if (util.isString(options.delay) &&
								isNaN((options.delay = parseInt(options.delay))))
							options.delay = 0;
						if (!util.isInt(options.delay) ||
								options.delay < 0)
							options.delay = 0;

						// Resolve
						resolve();
					});
				},

				// Set text
        set: (str) => {
					let text;
					str = str.toString();
      		do {
      		  text = (text || str.split(`.`)[0])
      		        	.replace(options.regex, `$1,$2`)
      		} while (text.match(options.regex));
      		return (str.split(`.`)[1]) ?
      		    		text.concat(`.`, str.split(`.`)[1]) :
      		    		text;
        },

				// Stop/Reset
				stop: (isReset=false) => {
					$(options.skeleton).each(function() {
						$(this).prop('Counter', 0).stop();
						if (util.isBoolean(isReset) && isReset)
							$(this).text('0');
					});
				}
			};

      return {

				// Initialize
				init: (args) => {

					// Set options
					methods.options(args).then(() => {

						// Stop/Reset
						methods.stop(true);
					});
        },

				// Start
				start: () => {
					$timeout(() => {
						$(options.skeleton).each(function() {
							let element = $(this);
							element.text('0');
							element.prop('Counter', 0).stop().animate({
								Counter: element.data(options.dataset) || 0
							}, {
								duration: options.duration,
								easing 	: 'swing',
								step 		: now => element.text(methods.set(Math.ceil(now)))
							});
						});
					}, options.delay);
				},

				// Stop/Reset
				stop: (isReset=false) => {
					methods.stop(isReset);
				}
      }
    }
  ])

})(window, angular);