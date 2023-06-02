define([
   'Core/core-clone',
   'Controls/dateRange',
   'ControlsUnit/Calendar/Utils'
], function (cClone, dateRange, calendarTestUtils) {
   'use strict';

   const RelationWrapper = dateRange.RelationWrapper;

   describe('Controls.dateRange:RelationWrapper', function () {
      it('should generate an event on date changed', function () {
         let component = calendarTestUtils.createComponent(RelationWrapper, {
               number: 0
            }),
            startDate = new Date(),
            endDate = new Date();

         jest.spyOn(component, '_notify').mockClear().mockImplementation();
         component._onRangeChanged(null, startDate, endDate);

         expect(component._notify).toHaveBeenCalledWith(
            'relationWrapperRangeChanged',
            [startDate, endDate, 0, undefined],
            { bubbling: true }
         );
      });
   });
});
