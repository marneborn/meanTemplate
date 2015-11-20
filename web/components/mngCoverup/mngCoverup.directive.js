/**
 *
 */

(function () {
    "use strict";

    // First need to register this module with the main app.
    var moduleName = 'mngCoverup',

	    // The zIndex to apply to the divs created.
	    // This needs to be higher than the zIndex of other siblings...
	    // FIXME: look at all siblings and set the zindex accordingly???
	    // FIXME: along with that, add an attribute to skip zindex checking mng-coverup-clickable???
	    zIndex   = 1000;

    window.registerModule(moduleName, ['makeStyleSheetModule'])
    .directive(moduleName, MngCoverup);

    MngCoverup.$inject = ['$q', '$window', 'makeStyleSheet'];
    function MngCoverup ($q, $window, makeStyleSheet) {

        makeStyleSheet(moduleName, getCss());

		return {
			restrict     : 'EA',

			scope        : {
				centered           : '=?',
				centeredHorizontal : '=?',
				centeredVertical   : '=?'
			},

			transclude   : true,
			template    : '<div class="mng-coverup-container">'+
			'<div class="mng-coverup-background"></div>'+
			'<div data-ng-transclude class="mng-coverup-content"></div>'+
			'</div>',

			link : link
		};

        /*
         * The angular directive link function. This handles the needed DOM manipulation.
         */
	    function link ( scope, element ) {

            setDefaults(scope);

            // Add the needed elements to the DOM
		    var parent    = element.parent(),
                container, content, background;

            // If only jqlite .find could do this...
		    var divs = element.find("div");
		    for (var i=0; i<divs.length; i++) {
			    var el = divs[i];
			    if ( !content && el.getAttribute('class') === 'mng-coverup-content') {
				    content = angular.element(el);
			    }
			    if ( !container && el.getAttribute('class') === 'mng-coverup-container') {
				    container = angular.element(el);
			    }
			    if ( !background && el.getAttribute('class') === 'mng-coverup-background') {
				    background = angular.element(el);
			    }
		    }

            shapeBackground(parent, background);

            // If the parent is positioned, it's height and width are simply 100%
            // Otherwise need to calculate the dimensions and positioning.
            if (!isPositioned(parent)) {

                // Place in the current context
                placeContainer(container, getElementRect(parent));

                // Replace when all images are loaded - FIXME - on each...
                waitForChildImages(scope, parent)
                .then(function () {
                    placeContainer(container, getElementRect(parent));
                });

                scope.$watch(
                    function () {
                        return getElementRect(parent);
                    },
                    function (newSize) {
                        placeContainer(container, newSize);
                    },
                    true /* deep compare */
                );
            }

		    // Changes to either the content or the container size will make the placement change
		    // to keep the content centered.
		    if ( scope.centeredVertical || scope.centeredHorizontal ) {
			    scope.$watch(
					function () {
                        return {
                            container : getElementRect(container),
                            content   : getElementRect(content)
                        };
					},
					function (newObj) {
                        placeContent(scope, content, newObj.container, newObj.content);
                    },
                    true /* Deep compare */
			    );
		    }
		    else {
			    // the watch isn't added if the content isn't centered, so place here once.
                var containerRect = getElementRect(container),
                    contentRect   = getElementRect(content);

			    placeContent(scope, content, containerRect, contentRect);
		    }

            return;
	    }

        /*
         * Setup necessary scope properties with default values
         */
        function setDefaults (scope) {

	        // if neither centered-horizontal nor centered-vertical,
            // then check if the centered attribute is set and use that.
		    if ( scope.centeredHorizontal === undefined && scope.centeredVertical === undefined ) {
			    if ( scope.centered === undefined || scope.centered ) {
				    scope.centeredHorizontal = true;
				    scope.centeredVertical   = true;
			    }
			    else {
				    scope.centeredHorizontal = false;
				    scope.centeredVertical   = false;
			    }
		    }

            // Otherwise center each individually if not set.
		    else if ( scope.centeredHorizontal === undefined ) {
			    scope.centeredHorizontal = !scope.centeredVertical;
		    }
		    else if ( scope.centeredVertical === undefined ) {
			    scope.centeredVertical = !scope.centeredHorizontal;
		    }
        }

        /*
         * Determine if the element is positioned.
         * The coverupContainer is absolutely placed so gets it's size from the parent.
         * This only works if the parent is positioned.
         */
        function isPositioned (el) {
            return el.css('position') !== 'static';
        }

        /*
         *
         */
        function placeContainer (container, parentRect) {
            container.css('left',    parentRect.left+'px');
            container.css('top',     parentRect.top+'px');
            container.css('height',  parentRect.height+'px');
            container.css('width',   parentRect.width+'px');
        }

        /*
	     * Move the content div to the correct place.
         */
	    function placeContent ( scope, content, containerRect, contentRect) {

		    // When centering horizontally, don't let the top edge of the content go above the container
		    if ( scope.centeredHorizontal ) {

			    if ( contentRect.width < containerRect.width ) {
                    content.css('left',  '50%');
				    content.css('marginLeft',  -1*contentRect.width/2+'px');
			    }
			    else {
				    content.css('left',  '0px');
				    content.css('marginLeft',  '0px');
			    }
		    }

		    // When centering vertically, don't let the left edge of the content go past the container
		    if ( scope.centeredVertical ) {
			    if ( contentRect.height < containerRect.height ) {
                    content.css('top',  '50%');
				    content.css('marginTop',  -1*contentRect.height/2+'px');
			    }
			    else {
				    content.css('top',  '0px');
				    content.css('marginTop',  '0px');
			    }
		    }
	    }

        /*
         *
         */
        function waitForChildImages (scope, element) {

            return $q.all(
                element.find('img')
                .map(function (idx, img) {
                    var defer = $q.defer(),
                        resolveIt = function () {
                            defer.resolve();
                        };

                    angular.element(img)
                    .bind('load' , resolveIt)
                    .bind('error', resolveIt)
                    .bind('abort', resolveIt);

                    scope.$on('$destroy',function(){
                        element.unbind('load');
                        element.unbind('error');
                        element.unbind('abort');
                    });

                    return defer.promise;
                })
            );
        }

        /*
         *
         */
        function getElementRect (el) {
		    var rect = el[0].getBoundingClientRect();
            return {
                top    : rect.top + $window.scrollY,
                left   : rect.left + $window.scrollX,
                height : rect.height,
                width  : rect.width
            };
        }

        /*
         *
         */
        function shapeBackground (parent, background) {
            var attrs = [
                'border-top-left-radius', 'border-top-right-radius',
                'border-bottom-left-radius', 'border-bottom-right-radius'
            ];

            for (var i=0; i<attrs.length; i++) {
                background.css(attrs[i], parent.css(attrs[i]));
            }
        }

        function getCss () {
            return [
                {
                    _selector : '.mng-coverup-container',
		            position  : 'absolute',
		            top       : '0px',
		            left      : '0px',
		            height    : '100%',
		            width     : '100%',
		            'z-index' : zIndex,
		            display   : 'block; '
                },
                {
	                _selector :'.mng-coverup-background',
		            position         : 'absolute',
		            top              : '0px',
                    left             : '0px',
                    'z-index'        : zIndex,
                    height           : '100%',
                    width            : '100%',
                    'background-color' : '#808080',
                    opacity          : '0.7'
	            },
                {
		            _selector : '.mng-coverup-content',
		            position  : 'absolute',
		            'z-index' : zIndex
                }
            ];
        }
    }
})();
