/**
 * Created by kraynovdo on 07.02.2018.
 */
define(['Controls/event'], function (events) {
   describe('Controls.Event.RegisterClass', function () {
      var evMock,
         compMock,
         result = false;
      beforeEach(function () {
         evMock = {
            stopPropagation: function () {
               return 1;
            }
         };
         compMock = {
            getInstanceId: function () {
               return '123abc';
            },
            _destroyed: false
         };
      });

      it('register - unregister', function () {
         const register = 'test';
         var reg = new events.RegisterClass({ register });

         reg.register(evMock, register, compMock, function () {
            result = true;
         });

         // проверяем что создалась запись
         expect(!!reg._registry['123abc']).toBe(true);

         // проверяем что корректный компонент
         expect(compMock).toEqual(reg._registry['123abc'].component);

         reg.unregister(evMock, register, compMock);
         expect(!reg._registry['123abc']).toBe(true);

         reg.destroy();
      });

      it('start', function () {
         const register = 'test';
         var reg = new events.RegisterClass({ register });

         reg.register(evMock, register, compMock, function () {
            result = true;
         });

         result = false;
         reg.start();
         expect(result).toBe(true);

         reg.unregister(evMock, register, compMock);

         reg.destroy();
      });
   });
});
