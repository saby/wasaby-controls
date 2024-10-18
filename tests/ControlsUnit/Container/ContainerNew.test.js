define([
   'Env/Env',
   'Controls/_scroll/Container',
   'ControlsUnit/Calendar/Utils',
   'wml!ControlsUnit/Container/resources/Content',
   'Controls/_scroll/Container/PagingModel'
], function (Env, ScrollContainer, utils, Content, PagingModel) {
   'use strict';

   describe('Controls.Container.Scroll', function () {
      var scroll;

      beforeEach(function () {
         scroll = new ScrollContainer.default(ScrollContainer.default.getDefaultOptions());
         scroll._options = ScrollContainer.default.getDefaultOptions();

         var templateFn = scroll._template;

         scroll._template = function (inst) {
            inst._options = {
               userContent: Content,
               theme: 'default'
            };
            var markup = templateFn.call(this, inst);

            markup = markup.replace(
               / ?(ws-delegates-tabfocus|ws-creates-context|__config|tabindex|name)=".+?"/g,
               ''
            );
            markup = markup.replace(/\s+/g, ' ');

            return markup;
         };
         scroll._registeredHeadersIds = [];
         scroll._stickyHeadersIds = {
            top: [],
            bottom: []
         };
         scroll._headersHeight = {
            top: 0,
            bottom: 0
         };
         scroll._headersWidth = {
            left: 0,
            right: 0
         };
         scroll._children.stickyHeaderShadow = {
            start: jest.fn()
         };
         scroll._children.content = {
            offsetHeight: 40,
            scrollHeight: 50,
            scrollTop: 10
         };
         scroll._displayState = {
            contentHeight: 0,
            shadowVisible: {
               top: false,
               bottom: false,
               left: false,
               right: false
            }
         };
         scroll._shadowVisibilityByInnerComponents = {
            top: 'auto',
            bottom: 'auto'
         };

         scroll._isMounted = true;

         scroll._children.scrollBar = {
            _position: 0,
            setViewportSize: jest.fn()
         };
      });

      describe('canScrollTo', function () {
         [
            {
               offset: 0,
               scrollHeight: 100,
               clientHeight: 100,
               result: true
            },
            {
               offset: 50,
               scrollHeight: 200,
               clientHeight: 100,
               result: true
            },
            {
               offset: 50,
               scrollHeight: 100,
               clientHeight: 100,
               result: false
            }
         ].forEach(function (test) {
            it(`should return ${test.result} if offset = ${test.offset},  scrollHeight = ${test.scrollHeight},  clientHeight = ${test.clientHeight}`, function () {
               scroll._scrollModel = {
                  scrollHeight: test.scrollHeight,
                  clientHeight: test.clientHeight
               };

               if (test.result) {
                  expect(scroll.canScrollTo(test.offset)).toBe(true);
               } else {
                  expect(scroll.canScrollTo(test.offset)).toBe(false);
               }
            });
         });
      });

      describe('Paging buttons. PagingModel', function () {
         beforeEach(function () {
            scroll._container = {
               closest: jest.fn()
            };
            scroll._stickyHeaderController = {
               setCanScroll: () => {
                  return {
                     then: () => {
                        return undefined;
                     }
                  };
               },
               resizeHandler: () => {
                  return undefined;
               }
            };
         });
         it('Content at the top', function () {
            scroll._paging = new PagingModel.default();
            scroll._paging.update({
               verticalPosition: 'start'
            });

            expect(scroll._paging._arrowState.begin).toEqual('readonly');
            expect(scroll._paging._arrowState.next).toEqual('visible');
         });
         it('Content at the middle', function () {
            scroll._paging = new PagingModel.default();
            scroll._paging.update({
               verticalPosition: 'middle'
            });

            expect(scroll._paging._arrowState.begin).toEqual('visible');
            expect(scroll._paging._arrowState.next).toEqual('visible');
         });
         it('Content at the bottom', function () {
            scroll._paging = new PagingModel.default();
            scroll._paging.update({
               verticalPosition: 'end'
            });

            expect(scroll._paging._arrowState.begin).toEqual('visible');
            expect(scroll._paging._arrowState.next).toEqual('readonly');
         });
      });
   });
});
