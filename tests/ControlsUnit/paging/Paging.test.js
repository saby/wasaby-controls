/**
 * Created by kraynovdo on 02.03.2018.
 */
define(['Controls/paging'], function (pagingLib) {
   describe('Controls.List.Paging', function () {
      var result = false;
      it('initArrowDefaultStates', function () {
         var pg = new pagingLib.Paging();

         pg._initArrowDefaultStates({});
         expect('normal').toEqual(pg._stateBackward);
         expect('normal').toEqual(pg._stateForward);

         pg._initArrowDefaultStates({
            arrowState: {
               begin: 'visible',
               end: 'visible',
               next: 'visible',
               prev: 'visible'
            }
         });
         expect('normal').toEqual(pg._stateBackward);
         expect('normal').toEqual(pg._stateForward);
      });

      it('initArrowStateBySelectedPage', function () {
         var cfg = {
            pagesCount: 5,
            selectedPage: 1
         };
         var pg = new pagingLib.Paging(cfg);

         pg._initArrowStateBySelectedPage(cfg);
         expect('disabled').toEqual(pg._stateBackward);
         expect('disabled').toEqual(pg._stateTop);
         expect('normal').toEqual(pg._stateForward);
         expect('normal').toEqual(pg._stateBottom);

         cfg = {
            pagesCount: 5,
            selectedPage: 3
         };
         pg._initArrowStateBySelectedPage(cfg);
         expect('normal').toEqual(pg._stateBackward);
         expect('normal').toEqual(pg._stateTop);
         expect('normal').toEqual(pg._stateForward);
         expect('normal').toEqual(pg._stateBottom);

         cfg = {
            pagesCount: 5,
            selectedPage: 5
         };
         pg._initArrowStateBySelectedPage(cfg);
         expect('normal').toEqual(pg._stateBackward);
         expect('normal').toEqual(pg._stateTop);
         expect('disabled').toEqual(pg._stateForward);
         expect('disabled').toEqual(pg._stateBottom);
      });

      it('changePage', function () {
         var cfg = {
            selectedPage: 3
         };
         var pg = new pagingLib.Paging(cfg);
         pg.saveOptions(cfg);

         // определяем нотифай, чтоб понять произошел ли он
         pg._notify = function () {
            result = true;
         };

         result = false;
         pg._changePage(1);
         expect(result).toBe(true);

         result = false;
         pg._changePage(3);
         expect(result).toBe(false);
      });
      it('life cycle', function () {
         var cfg1 = {
            showDigits: true,
            selectedPage: 3,
            pagesCount: 5
         };
         var cfg2 = {};
         var pg = new pagingLib.Paging(cfg1);
         pg.saveOptions(cfg1);
         pg._beforeMount(cfg1);

         expect('normal').toEqual(pg._stateBackward);
         expect('normal').toEqual(pg._stateForward);

         cfg1.selectedPage = 5;
         pg._beforeUpdate(cfg1);
         expect('normal').toEqual(pg._stateBackward);
         expect('disabled').toEqual(pg._stateForward);

         pg = new pagingLib.Paging(cfg1);
         pg.saveOptions(cfg1);
         pg._beforeMount(cfg2);
         expect('normal').toEqual(pg._stateBackward);
         expect('normal').toEqual(pg._stateForward);

         pg = new pagingLib.Paging(cfg1);
         pg.saveOptions(cfg1);
         pg._beforeUpdate(cfg2);
         expect('normal').toEqual(pg._stateBackward);
         expect('normal').toEqual(pg._stateForward);
      });

      it('click', function () {
         var cfg1 = {
            showDigits: true,
            selectedPage: 3,
            pagesCount: 5
         };

         var pg = new pagingLib.Paging(cfg1);
         pg.saveOptions(cfg1);

         // определяем нотифай, чтоб понять произошел ли он
         pg._notify = function (eName, args) {
            if (eName === 'selectedPageChanged') {
               result = args[0];
            }
         };

         // проверяем клик на цифру
         result = null;
         pg._digitClick({}, 1);
         expect(1).toEqual(result);

         // проверяем клики на стрелки
         result = null;
         pg._arrowClick({}, 'Begin', 'Backward');
         expect(1).toEqual(result);
         pg._arrowClick({}, 'End', 'Forward');
         expect(5).toEqual(result);
         pg._arrowClick({}, 'Prev', 'Backward');
         expect(2).toEqual(result);
         pg._arrowClick({}, 'Next', 'Forward');
         expect(4).toEqual(result);

         // проверяем клики на задизабленные стрелки
         cfg1 = {
            showDigits: true,
            selectedPage: 1,
            pagesCount: 5
         };
         pg._beforeUpdate(cfg1);
         pg.saveOptions(cfg1);

         result = 0;
         pg._arrowClick({}, 'Begin', 'Backward');
         expect(0).toEqual(result);
      });
   });
   it('_isShowContentTemplate', function () {
      var pg = new pagingLib.Paging();
      pg.saveOptions({
         arrowState: {
            begin: 'visible',
            end: 'visible',
            next: 'visible',
            prev: 'visible'
         }
      });
      expect(pg._isShowContentTemplate()).toBe(true);
      pg.saveOptions({
         arrowState: {
            begin: 'visible',
            end: 'hidden',
            next: 'hidden',
            prev: 'hidden'
         }
      });
      expect(pg._isShowContentTemplate()).toBe(true);
      pg.saveOptions({
         arrowState: {
            begin: 'hidden',
            end: 'hidden',
            next: 'hidden',
            prev: 'hidden'
         }
      });
      expect(pg._isShowContentTemplate()).toBe(false);
   });
   it('_getArrowStateVisibility', function () {
      var pg = new pagingLib.Paging();
      pg.saveOptions({
         arrowState: {
            begin: 'visible',
            end: 'visible',
            next: 'visible',
            prev: 'visible'
         }
      });
      expect(pg._getArrowStateVisibility('begin')).toEqual('visible');
      pg.saveOptions({
         pagingMode: 'numbers',
         arrowState: {
            begin: 'visible',
            end: 'hidden',
            next: 'hidden',
            prev: 'hidden'
         }
      });
      expect(pg._getArrowStateVisibility('begin')).toEqual('visible');

      pg.saveOptions({});
      expect(pg._getArrowStateVisibility('begin')).toEqual('hidden');

      pg.saveOptions({
         pagingMode: 'numbers'
      });
      expect(pg._getArrowStateVisibility('begin')).toEqual('visible');
   });
   it('_needLeftPadding', () => {
      const pg = new pagingLib.Paging();

      // Если в режиме 'end' или 'edge' есть contentTemplate, то крайний левый отступ будет на нем, а не на кнопке
      expect(pg._needLeftPadding('end', {})).toBe(false);
      expect(pg._needLeftPadding('edge', {})).toBe(false);
      expect(pg._needLeftPadding('end')).toBe(true);
      expect(pg._needLeftPadding('edge')).toBe(true);
      expect(pg._needLeftPadding('basic')).toBe(true);
      expect(pg._needLeftPadding('numbers')).toBe(true);
   });
});
