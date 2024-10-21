define(['Controls/popup'], (popup) => {
   'use strict';
   var waitPrefetchData = popup.waitPrefetchData;
   describe('Preload util', () => {
      it('waitPrefetchData', () => {
         const prefetchPromise = new Promise((resolve) => {
            const promise1 = new Promise((resolve1) => {
               return setTimeout(() => {
                  resolve1('data1');
               }, 1);
            });
            const promise2 = new Promise((resolve2) => {
               return setTimeout(() => {
                  resolve2('data2');
               }, 10);
            });
            resolve({
               loader1: promise1,
               loader2: promise2
            });
         });
         const prefetchData = {
            loader1: 'data1',
            loader2: 'data2'
         };
         return waitPrefetchData(prefetchPromise).then((data) => {
            expect(data).toEqual(prefetchData);
         });
      });
   });
});
