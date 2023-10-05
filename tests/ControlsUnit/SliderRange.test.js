define(['Controls/slider'], function (slider) {
   describe('Controls.slider:Range', function () {
      it('calculations', function () {
         var sb = new slider.Range({});
         var pointData = [{
            name: 'start',
            position: 40
         }, {
            name: 'end',
            position: 80
         }];

         var point = sb._getClosestPoint(10, pointData);
         expect('start').toEqual(point.name);

         point = sb._getClosestPoint(100, pointData);
         expect('end').toEqual(point.name);

         point = sb._getClosestPoint(55, pointData);
         expect('start').toEqual(point.name);

         point = sb._getClosestPoint(69, pointData);
         expect('end').toEqual(point.name);
      });
   });
});
