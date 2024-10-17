/**
 * Created by kraynovdo on 02.11.2017.
 */
define(['Controls/_paging/Paging/DigitButtons'], function (DigitButtons) {
   var DBClass = DigitButtons.default;
   let DOTS = '…';
   describe('Controls.List.Paging.DigitButtons', function () {
      it('getDrawnDigits 10 pages', function () {
         var digits;
         digits = DBClass._getDrawnDigits(10, 1);
         expect([1, 2, 3, 4, 5, DOTS, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 2);
         expect([1, 2, 3, 4, 5, DOTS, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 3);
         expect([1, 2, 3, 4, 5, DOTS, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 4);
         expect([1, 2, 3, 4, 5, DOTS, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 5);
         expect([1, DOTS, 4, 5, 6, DOTS, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 6);
         expect([1, DOTS, 5, 6, 7, DOTS, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 7);
         expect([1, DOTS, 6, 7, 8, 9, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 8);
         expect([1, DOTS, 6, 7, 8, 9, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 9);
         expect([1, DOTS, 6, 7, 8, 9, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 10);
         expect([1, DOTS, 6, 7, 8, 9, 10]).toEqual(digits);
      });

      it('getDrawnDigits 15 pages', function () {
         var digits;
         digits = DBClass._getDrawnDigits(15, 7);
         expect([1, DOTS, 6, 7, 8, DOTS, 15]).toEqual(digits);
      });

      it('getDrawnDigits 5 pages', function () {
         var digits;

         digits = DBClass._getDrawnDigits(5, 1);
         expect([1, 2, 3, 4, 5]).toEqual(digits);

         digits = DBClass._getDrawnDigits(5, 2);
         expect([1, 2, 3, 4, 5]).toEqual(digits);

         digits = DBClass._getDrawnDigits(5, 3);
         expect([1, 2, 3, 4, 5]).toEqual(digits);

         digits = DBClass._getDrawnDigits(5, 4);
         expect([1, 2, 3, 4, 5]).toEqual(digits);

         digits = DBClass._getDrawnDigits(5, 5);
         expect([1, 2, 3, 4, 5]).toEqual(digits);
      });

      it('getDrawnDigits 10 pages in mode numbers', function () {
         var digits;
         digits = DBClass._getDrawnDigits(10, 1, 'numbers');
         expect([1, 2, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 2, 'numbers');
         expect([1, 2, 3, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 3, 'numbers');
         expect([1, 2, 3, 4, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 4, 'numbers');
         expect([DOTS, 3, 4, 5, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 5, 'numbers');
         expect([DOTS, 4, 5, 6, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 6, 'numbers');
         expect([DOTS, 5, 6, 7, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 7, 'numbers');
         expect([DOTS, 6, 7, 8, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 8, 'numbers');
         expect([DOTS, 7, 8, 9, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 9, 'numbers');
         expect([DOTS, 8, 9, 10]).toEqual(digits);

         digits = DBClass._getDrawnDigits(10, 10, 'numbers');
         expect([DOTS, 9, 10]).toEqual(digits);
      });

      it('getDrawnDigits 15 pages in mode numbers', function () {
         var digits;
         digits = DBClass._getDrawnDigits(15, 7, 'numbers');
         expect([DOTS, 6, 7, 8, DOTS]).toEqual(digits);
      });

      it('getDrawnDigits 5 pages in mode numbers', function () {
         var digits;

         digits = DBClass._getDrawnDigits(5, 1, 'numbers');
         expect([1, 2, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(5, 2, 'numbers');
         expect([1, 2, 3, DOTS]).toEqual(digits);

         digits = DBClass._getDrawnDigits(5, 3, 'numbers');
         expect([1, 2, 3, 4, 5]).toEqual(digits);

         digits = DBClass._getDrawnDigits(5, 4, 'numbers');
         expect([DOTS, 3, 4, 5]).toEqual(digits);

         digits = DBClass._getDrawnDigits(5, 5, 'numbers');
         expect([DOTS, 4, 5]).toEqual(digits);
      });
      it('_getDigitRender callback undefined', function () {
         const db = new DBClass();
         db.saveOptions({
            digitRenderCallback: undefined
         });
         expect(db._getDigitRender(4)).toEqual(4);
      });
      it('_getDigitRender callback defined', function () {
         const db = new DBClass();
         db.saveOptions({
            digitRenderCallback: (index) => {
               switch (index) {
                  case 1:
                     return '🐭';
                  case 4:
                     return '🐠';
                  default:
                     break;
               }
            }
         });

         expect(db._getDigitRender(4)).toEqual('🐠');
         expect(db._getDigitRender(1)).toEqual('🐭');
         expect(db._getDigitRender(7)).toEqual(7);
      });
   });
});
