define(['Controls/_search/Input/Search'], function (searchExport) {
   'use strict';
   const Search = searchExport.default;

   describe('Controls/_search/Input/Search', function () {
      describe('search', function () {
         it('Click on search', function () {
            let search = new Search();
            let searched = false;
            let activated = false;
            let newValue = '';
            const eventMock = { stopPropagation: jest.fn() };

            search._beforeMount({});
            search._notify = (e, args) => {
               if (e === 'searchClick') {
                  searched = true;
               } else if (e === 'valueChanged') {
                  newValue = args[0];
               }
            };
            search.activate = () => {
               activated = true;
            };

            search._options.readOnly = true;
            search._searchClick(eventMock);
            expect(searched).toBe(false);
            expect(activated).toBe(false);

            search._options.readOnly = false;
            search._searchClick(eventMock);
            expect(activated).toBe(true);

            searched = activated = false;
            search._searchClick(eventMock);
            expect(searched).toBe(false);
            expect(activated).toBe(true);

            search._options.trim = true;
            search._viewModel.displayValue = '    test text     ';
            search._searchClick(eventMock);
            expect(search._viewModel.displayValue).toEqual('test text');
            expect(newValue).toEqual('test text');
         });

         it('_resetClick', function () {
            let search = new Search();
            let resetClicked = false;
            let activated = false;

            search._beforeMount({
               value: ''
            });

            search._notify = (e, args) => {
               if (e === 'resetClick') {
                  resetClicked = true;
               } else if (e === 'valueChanged') {
                  expect(args[0]).toEqual('');
               }
            };
            search.activate = () => {
               activated = true;
            };

            search._resetClick();
            expect(resetClicked).toBe(true);
            expect(activated).toBe(true);
            resetClicked = activated = false;
            search._options.readOnly = true;
            search._searchClick();
            expect(resetClicked).toBe(false);
            expect(activated).toBe(false);
         });

         it('_resetClick', function () {
            let search = new Search();
            let eventPreventDefault = false;
            let eventStopPropagation = false;
            let event = {
               stopPropagation: () => {
                  eventStopPropagation = true;
               },
               preventDefault: () => {
                  eventPreventDefault = true;
               }
            };

            search._resetMousedown(event);
            expect(eventPreventDefault).toBe(true);
            expect(eventStopPropagation).toBe(true);
         });

         it('reset', function () {
            let valueReseted = false;
            let search = new Search();
            search._resetClick = () => {
               valueReseted = true;
            };
            search.reset();
            expect(valueReseted).toBe(true);
         });

         it('Enter click', function () {
            let search = new Search();
            let activated = false;
            search._notify = (e) => {
               expect(e).toEqual('searchClick');
            };
            search.activate = () => {
               activated = true;
            };
            search._keyDownHandler({
               nativeEvent: {
                  which: 13 // enter key
               }
            });
            expect(activated).toBe(true);
         });

         it('Focus out', function () {
            let search = new Search();

            const beforeMount = search._beforeMount;

            search._beforeMount = function () {
               beforeMount.apply(this, arguments);

               search._children[this._fieldName] = {
                  selectionStart: 0,
                  selectionEnd: 0,
                  value: '',
                  focus: jest.fn(),
                  setSelectionRange: function (start, end) {
                     this.selectionStart = start;
                     this.selectionEnd = end;
                  }
               };
            };

            search._options = {};
            search._beforeMount({
               value: null
            });
            search._options.trim = true;
            search._options.value = null;

            search._focusOutHandler();
         });

         it('isVisibleResetButton', function () {
            let search = new Search();
            search._beforeMount({ readOnly: false, value: '' });
            expect(Search._private.isVisibleResetButton.call(search)).toBe(false);

            search._viewModel.displayValue = 'test text';
            expect(Search._private.isVisibleResetButton.call(search)).toBe(true);

            search._options.readOnly = true;
            expect(Search._private.isVisibleResetButton.call(search)).toBe(false);
         });
      });
   });
});
