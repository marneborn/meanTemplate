/**
 *
 */

(function () {
    "use strict";

    window.registerModule('makeStyleSheetModule')
    .constant('makeStyleSheet', function (title, rules) {
        var cssTitle = title+'StyleSheet',
            style = hasCSS(cssTitle);

        if (style) {
            return style;
        }

        style = createStyleSheet(cssTitle);
        addCSS(style, rules);

        return style;
    });

    /*
     * Check to see if there is already a css styleSheet associated with this directive.
     */
	function hasCSS (cssTitle) {
		for (var i=0; i<document.styleSheets.length; i++) {
			if ( document.styleSheets[i].title === cssTitle) {
				return document.styleSheets[i];
			}
		}
		return null;
	}

    /*
     *
     */
    function createStyleSheet (cssTitle) {

		var style = document.createElement("style");
		style.type = 'text/css';
		style.title = cssTitle;

        // put at the top of the list so that things specified by the user are used.
		if (document.head.childNodes.length === 0) {
			document.head.appendChild(style);
		}
		else {
			document.head.insertBefore(style, document.head.childNodes[0]);
		}

        return style;
    }

    /*
     * Create a syleSheet for this directive populating with defaults.
     * Put it at the front so that the user can override in there own sheets.
     */
	function addCSS (styleObj, rules) {

        var i;

        if (styleObj.sheet.addRule) {
            for (i=0; i<rules.length; i++) {
                styleObj.sheet.addRule(
                    rules[i]._selector,
                    obj2str(rules[i])
                );
            }
        }
        else if (styleObj.sheet.insertRule) {
            for (i=0; i<rules.length; i++) {
                styleObj.sheet.insertRule(
                    rules[i]._selector+" { "+obj2str(rules[i])+" }",
                    0
                );
            }
        }
        else {
            console.error("No addRule method...");
        }

	}

    function obj2str (rule) {
        var keys = Object.keys(rule),
            arr = [],
            i;

        for (i=0; i<keys.length; i++) {
            if (keys[i] === '_selector') {
                continue;
            }
            arr.push(keys[i]+' : '+rule[keys[i]]+';');
        }
        return arr.join(' ');
    }
})();
