define(['Controls/slider'], function (slider) {
   describe('Controls.slider:Range', function () {
      it('calculations', function () {
         var sb = new slider.Range({});
         var startValue = 40;
         var endValue = 80;

         var pointName = sb._getClosestPoint(10, startValue, endValue);
         expect('start').toEqual(pointName);

         pointName = sb._getClosestPoint(100, startValue, endValue);
         expect('end').toEqual(pointName);

         pointName = sb._getClosestPoint(55, startValue, endValue);
         expect('start').toEqual(pointName);

         pointName = sb._getClosestPoint(69, startValue, endValue);
         expect('end').toEqual(pointName);
      });
   });
});
