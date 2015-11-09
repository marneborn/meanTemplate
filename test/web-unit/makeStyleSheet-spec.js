(function () {
    "use strict";

    describe("makeStyleSheet", function () {

        var makeStyleSheet;

        // load the controller's module
        beforeEach(module('makeStyleSheetModule'));

        // Initialize the controller and a mock scope
        beforeEach(inject(function (_makeStyleSheet_) {
            makeStyleSheet = _makeStyleSheet_;
        }));

        it('should add a style sheet', function () {
            var before = document.styleSheets.length;
            var style = makeStyleSheet('foo', []);
            expect(document.styleSheets.length).toBe(before+1);
            document.head.removeChild(style);
        });

        it('should add a rule', function () {
            makeStyleSheet('foo', [
                {
                    _selector : '.foo',
                    position : 'fixed'
                }
            ]);

            expect(document.styleSheets[0].cssRules[0].cssText)
            .toBe('.foo { position: fixed; }');
        });
    });
}) ();
