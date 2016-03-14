(function () {
    "use strict";

    describe("makeStyleSheet", function () {

        var makeStyleSheet, added;

        beforeEach(function () {
            added = null;
        });

        afterEach(function (done) {
            if (added) {
                document.head.removeChild(added);
            }
            setTimeout(done);
        });

        // load the controller's module
        beforeEach(module('makeStyleSheetModule'));

        // Initialize the controller and a mock scope
        beforeEach(inject(function (_makeStyleSheet_) {
            makeStyleSheet = _makeStyleSheet_;
        }));

        it('should add a style sheet', function () {
            var before = document.styleSheets.length;
            added = makeStyleSheet('foo', []);

            expect(document.styleSheets.length)
            .toBe(before+1);
        });

        it('should add a rule', function () {
            added = makeStyleSheet('bar', [
                {
                    _selector : '.bar',
                    position : 'fixed'
                }
            ]);

            expect(document.styleSheets[0].cssRules[0].cssText)
            .toBe('.bar { position: fixed; }');
        });
    });
}) ();
