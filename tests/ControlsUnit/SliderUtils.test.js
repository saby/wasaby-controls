define(['Controls/_slider/Utils'], function (utils) {
   describe('Controls.slider Utils', function () {
      it('calculations', function () {
         var minValue = 10;
         var maxValue = 100;
         var width = 200;
         var left = 100;
         var right = 300;
         var precision = 0;
         var scaleData;
         var clickX = 100;

         var ratio = utils.default.getRatio(clickX, left, right, width);
         expect(0).toEqual(ratio);
         var newValue = utils.default.calcValue(minValue, maxValue, ratio, precision);
         expect(10).toEqual(newValue);

         clickX = 300;

         ratio = utils.default.getRatio(clickX, left, right, width);
         expect(1).toEqual(ratio);
         newValue = utils.default.calcValue(minValue, maxValue, ratio, precision);
         expect(100).toEqual(newValue);

         clickX = 200;

         ratio = utils.default.getRatio(clickX, left, right, width);
         expect(0.5).toEqual(ratio);
         newValue = utils.default.calcValue(minValue, maxValue, ratio, precision);
         expect(55).toEqual(newValue);

         clickX = 230;

         ratio = utils.default.getRatio(clickX, left, right, width);
         expect(0.65).toEqual(ratio);
         newValue = utils.default.calcValue(minValue, maxValue, ratio, precision);
         expect(69).toEqual(newValue);

         var scaleStep = 20;
         var expectedScale = [
            { value: 10, position: 0 },
            { value: 30, position: 22.22222222222222 },
            { value: 50, position: 44.44444444444444 },
            { value: 70, position: 66.66666666666666 },
            { value: 90, position: 88.88888888888889 },
            { value: 100, position: 100 }
         ];
         scaleData = utils.default.getScaleData(minValue, maxValue, scaleStep);
         expect(expectedScale).toEqual(scaleData);

         scaleStep = 100;
         expectedScale = [
            { value: 10, position: 0 },
            { value: 100, position: 100 }
         ];
         scaleData = utils.default.getScaleData(minValue, maxValue, scaleStep);
         expect(expectedScale).toEqual(scaleData);

         scaleStep = 30;
         expectedScale = [
            { value: 10, position: 0 },
            { value: 40, position: 33.33333333333333 },
            { value: 70, position: 66.66666666666666 },
            { value: 100, position: 100 }
         ];
         scaleData = utils.default.getScaleData(minValue, maxValue, scaleStep);
         expect(expectedScale).toEqual(scaleData);
      });

      it('getScaleData', function () {
         const formatter = (value) => {
            return value * 2;
         };

         const expected = [
            {
               position: 0,
               value: 6
            },
            {
               position: 33.33333333333333,
               value: 8
            },
            {
               position: 66.66666666666666,
               value: 10
            },
            {
               position: 100,
               value: 12
            }
         ];
         const actual = utils.default.getScaleData(3, 6, 1, formatter);
         expect(actual).toEqual(expected);
      });

      it('getNativeEventPageX', function () {
         let getNativeEventPageX = utils.default.getNativeEventPageX;
         let mouseEvent = {
            type: 'mousedown',
            pageX: 100,
            target: {
               closest: jest.fn()
            }
         };
         let touchEvent = {
            type: 'touchstart',
            touches: [
               {
                  pageX: 200
               }
            ],
            target: {
               closest: jest.fn()
            }
         };
         expect(getNativeEventPageX(mouseEvent)).toEqual(100);
         expect(getNativeEventPageX(touchEvent)).toEqual(200);
      });
   });
});
