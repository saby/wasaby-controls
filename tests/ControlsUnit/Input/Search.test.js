define(['Controls/_search/Input/Search'], function (searchExport) {
   'use strict';
   const Search = searchExport.default;

   describe('Controls/_search/Input/Search', function () {
      describe('search', function () {
         it('Click on search', function () {
            let search = new Search({ ...Search.defaultProps });
            let searched = false;
            let activated = false;
            let newValue = '';
            const eventMock = { stopPropagation: jest.fn() };

            search._mounted = true;
            search.props.onSearchClick = () => {
               searched = true;
            };
            search.props.onValueChanged = (e, value) => {
               newValue = value;
            };
            search.activate = () => {
               activated = true;
            };

            search.props.readOnly = true;
            search._searchClick(eventMock);
            expect(searched).toBe(false);
            expect(activated).toBe(false);

            search.props.readOnly = false;
            search._searchClick(eventMock);
            expect(activated).toBe(true);

            searched = activated = false;
            search._searchClick(eventMock);
            expect(searched).toBe(false);
            expect(activated).toBe(true);

            search.props.trim = true;
            search._viewModel.displayValue = '    test text     ';
            search._searchClick(eventMock);
            expect(search._viewModel.displayValue).toEqual('test text');
            expect(newValue).toEqual('test text');
         });

         it('_resetClick', function () {
            let search = new Search({ ...Search.defaultProps, value: '' });
            let resetClicked = false;
            let activated = false;

            search.props.onResetClick = () => {
               resetClicked = true;
            };
            search.props.onValueChanged = (e, value) => {
               expect(value).toEqual('');
            };

            search.activate = () => {
               activated = true;
            };

            search._resetClick();
            expect(resetClicked).toBe(true);
            expect(activated).toBe(true);
            resetClicked = activated = false;
            search.props.readOnly = true;
            search._searchClick();
            expect(resetClicked).toBe(false);
            expect(activated).toBe(false);
         });

         it('_resetClick', function () {
            let search = new Search({ ...Search.defaultProps });
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
            let search = new Search({ ...Search.defaultProps });
            search._resetSearch = () => {
               valueReseted = true;
            };
            search.reset();
            expect(valueReseted).toBe(true);
         });

         it('Enter click', function () {
            let search = new Search({ ...Search.defaultProps });
            let activated = false;
            let propagationStopped = false;
            search.activate = () => {
               activated = true;
            };
            search._keyDownHandler({
               stopPropagation: () => {
                  propagationStopped = true;
               },
               nativeEvent: {
                  which: 13 // enter key
               }
            });
            expect(activated).toBe(true);
            expect(propagationStopped).toBe(true);
         });

         it('Focus out', function () {
            let search = new Search({ ...Search.defaultProps, value: null });

            search.fieldNameRef.current = {
               selectionStart: 0,
               selectionEnd: 0,
               value: '',
               focus: jest.fn(),
               setSelectionRange: function (start, end) {
                  this.selectionStart = start;
                  this.selectionEnd = end;
               },
               getContainer: function () {
                  return undefined;
               }
            };

            search.props = {
               trim: true,
               value: null
            };

            search._focusOutHandler();
         });

         it('isVisibleResetButton', function () {
            let search = new Search({ ...Search.defaultProps, readOnly: false, value: '' });
            expect(Search._private.isVisibleResetButton.call(search)).toBe(false);

            search._viewModel.displayValue = 'test text';
            expect(Search._private.isVisibleResetButton.call(search)).toBe(true);

            search.props.readOnly = true;
            expect(Search._private.isVisibleResetButton.call(search)).toBe(false);
         });
      });
   });
});
