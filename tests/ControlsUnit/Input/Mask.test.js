define(['Core/core-merge', 'UI/Utils', 'Controls/input'], function (
   coreMerge,
   UIUtils,
   input
) {
   'use strict';

   let createComponent = function (Component, cfg) {
      let cmp;
      if (Component.getDefaultOptions) {
         // eslint-disable-next-line no-param-reassign
         cfg = coreMerge(cfg, Component.getDefaultOptions(), {
            preferSource: true
         });
      }
      cmp = new Component(cfg);
      cmp.saveOptions(cfg);
      cmp._beforeMount(cfg);
      return cmp;
   };

   describe('Controls/_input/Mask', function () {
      describe('_beforeUpdate', function () {
         [
            {
               mask: 'dd.dd',
               replacer: ' ',
               value: null,
               startValue: ''
            },
            {
               mask: 'dd.dd',
               replacer: ' ',
               value: '',
               startValue: '1234'
            },
            {
               mask: 'dd.dd',
               replacer: ' ',
               value: '1234',
               startValue: ''
            }
         ].forEach(function (test) {
            it('should update selection if value changed', function () {
               var component = createComponent(input.Mask, {
                  value: test.startValue,
                  mask: 'dd.dd',
                  replacer: ' '
               });
               component._viewModel.selection = {
                  start: 3,
                  end: 3
               };
               component._beforeUpdate(
                  coreMerge(test, input.Mask.getDefaultOptions(), {
                     preferSource: true
                  })
               );
               expect(component._viewModel.selection).toEqual({
                  start: 0,
                  end: 0
               });
            });
         });

         it('should not update selection if value changed', function () {
            var component = createComponent(input.Mask, {
               mask: 'dd.dd',
               replacer: ' '
            });
            component._viewModel.selection = {
               start: 3,
               end: 3
            };
            component._beforeUpdate(
               coreMerge(
                  {
                     mask: 'dd.dd',
                     replacer: ' '
                  },
                  input.Mask.getDefaultOptions(),
                  { preferSource: true }
               )
            );
            expect(component._viewModel.selection).toEqual({
               start: 3,
               end: 3
            });
         });
      });

      describe('_focusInHandler', function () {
         it('should set default selection position', function () {
            var component = createComponent(input.Mask, {
               mask: 'dd.dd',
               replacer: ' '
            });
            component._viewModel.selection = {
               start: 3,
               end: 3
            };
            jest
               .spyOn(component, '_getField')
               .mockClear()
               .mockImplementation(function () {
                  return { selectionStart: 0 };
               });
            component._focusInHandler({
               target: {}
            });
            expect(component._viewModel.selection).toEqual({
               start: 0,
               end: 0
            });
         });
         it('should not set update selection position if the focus was set by a mouse click', function () {
            const component = createComponent(input.Mask, {
               mask: 'dd.dd',
               replacer: ' '
            });
            component._viewModel.selection = {
               start: 3,
               end: 3
            };
            jest
               .spyOn(component, '_getField')
               .mockClear()
               .mockImplementation(function () {
                  return { selectionStart: 0 };
               });
            component._mouseDownHandler();
            component._focusInHandler({
               target: {}
            });
            expect(component._viewModel.selection).toEqual({
               start: 3,
               end: 3
            });
         });
      });

      describe('_clickHandler', function () {
         it('should set default selection position', function () {
            const component = createComponent(input.Mask, {
               mask: 'dd.dd',
               replacer: ' '
            });
            component._viewModel.selection = {
               start: 3,
               end: 3
            };
            jest
               .spyOn(component, '_getField')
               .mockClear()
               .mockImplementation(function () {
                  return {
                     getFieldData: function (name) {
                        if (name === 'selectionStart') {
                           return 0;
                        }
                     },
                     setSelectionRange: jest.fn()
                  };
               });
            component._mouseDownHandler();
            component._focusInHandler({
               target: {}
            });
            component._clickHandler();
            expect(component._viewModel.selection).toEqual({
               start: 0,
               end: 0
            });
         });
         it('should not update selection position on click on already focused field', function () {
            const component = createComponent(input.Mask, {
               mask: 'dd.dd',
               replacer: ' '
            });
            component._viewModel.selection = {
               start: 3,
               end: 3
            };
            jest
               .spyOn(component, '_getField')
               .mockClear()
               .mockImplementation(function () {
                  return { selectionStart: 0 };
               });
            component._mouseDownHandler();
            component._clickHandler();
            expect(component._viewModel.selection).toEqual({
               start: 3,
               end: 3
            });
         });
      });
   });
});
