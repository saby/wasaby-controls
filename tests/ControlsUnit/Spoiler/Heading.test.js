define(['Controls/spoiler'], function (spoiler) {
   'use strict';

   describe('Controls/spoiler:Heading', function () {
      var ctrl;
      var options;

      beforeEach(function () {
         ctrl = new spoiler.Heading();
         options = spoiler.Heading.getDefaultOptions();
      });

      describe('State by options', function () {
         it('Heading with expanded=true', function () {
            options.expanded = true;
            options.captions = ['Заголовок1', 'Заголовок2'];
            ctrl._beforeMount(options);

            expect(ctrl._view).toEqual('expanded');
            expect(ctrl._caption).toEqual('Заголовок1');
         });
         it('mount and click', function () {
            options.captions = ['Заголовок1', 'Заголовок2'];
            ctrl._beforeMount(options);
            expect(ctrl._expanded).toEqual(false);
            expect(ctrl._view).toEqual('collapsed');
            expect(ctrl._caption).toEqual('Заголовок2');
            ctrl._options = options;
            ctrl._clickHandler();
            ctrl._beforeUpdate(options);
            expect(ctrl._view).toEqual('expanded');
            expect(ctrl._caption).toEqual('Заголовок1');
         });
         it('fontColorStyle', function () {
            expect(spoiler.Heading._calcFontColorStyle(true)).toEqual(
               'secondary'
            );
            expect(spoiler.Heading._calcFontColorStyle(false)).toEqual('label');
            expect(spoiler.Heading._calcFontColorStyle(true, 'label')).toEqual(
               'label'
            );
            expect(spoiler.Heading._calcFontColorStyle(false, 'label')).toEqual(
               'label'
            );
            expect(
               spoiler.Heading._calcFontColorStyle(true, 'secondary')
            ).toEqual('secondary');
            expect(
               spoiler.Heading._calcFontColorStyle(false, 'secondary')
            ).toEqual('secondary');
         });
         it('fontWeight', function () {
            expect(spoiler.Heading._calcFontWeight(true)).toEqual('bold');
            expect(spoiler.Heading._calcFontWeight(false)).toEqual('default');
            expect(spoiler.Heading._calcFontWeight(true, 'bold')).toEqual(
               'bold'
            );
            expect(spoiler.Heading._calcFontWeight(false, 'bold')).toEqual(
               'bold'
            );
            expect(spoiler.Heading._calcFontWeight(true, 'default')).toEqual(
               'default'
            );
            expect(spoiler.Heading._calcFontWeight(false, 'default')).toEqual(
               'default'
            );
         });

         it('tooltip', () => {
            const heading = new spoiler.Heading();
            let textWidth = 20;
            let captionContainer = 40;

            heading._getTextWidth = () => {
               return textWidth;
            };
            heading._children = {
               captionContainer: {
                  clientWidth: captionContainer
               }
            };
            heading.saveOptions({
               tooltip: 'myTooltipOpt'
            });

            heading._mouseenterHandler();
            expect(heading._tooltip).toEqual('myTooltipOpt');

            heading.saveOptions({
               tooltip: null
            });
            heading._tooltip = '';
            heading._mouseenterHandler();
            expect(heading._tooltip).toEqual('');

            textWidth = 60;
            heading._mouseenterHandler(null, 'myCaption');
            expect(heading._tooltip).toEqual('myCaption');
         });
      });
   });
});
