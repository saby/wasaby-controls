define([
   'Core/core-merge',
   'Types/collection',
   'Controls/calendar',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils'
], function (coreMerge, collection, calendar, DateUtil, calendarTestUtils) {
   'use strict';

   let config = {
      month: new Date(2017, 0, 1)
   };

   describe('Controls/calendar:MonthViewModel', function () {
      describe('Initialisation', function () {
         it('should create the correct model for the month when creating', function () {
            let mvm, weeks;

            mvm = new calendar.MonthViewModel(config);
            weeks = mvm.getMonthArray();

            expect(weeks.length).toEqual(6);
            calendarTestUtils.assertMonthView(weeks);
            expect(
               DateUtil.Base.isDatesEqual(
                  weeks[0][0].date,
                  new Date(2016, 11, 26)
               )
            ).toBe(true);
         });
      });
      describe('_getDayObject', function () {
         let state = {
            mode: 'mode',
            month: new Date(2018, 0, 1),
            enabled: true
         };

         it('should create the object with correct extData', function () {
            let extData = 'some data',
               mvm,
               dayObj;

            mvm = new calendar.MonthViewModel(config);
            dayObj = mvm._getDayObject(
               new Date(2018, 0, 1),
               coreMerge({ daysData: [extData] }, state, { preferSource: true })
            );

            expect(dayObj.extData).toEqual(extData);
         });

         it('should create the object with correct days data if days data is RecordSet', function () {
            let dayData = { id: 0, data: 'data' },
               daysData = new collection.RecordSet({
                  rawData: [dayData]
               }),
               mvm,
               dayObj;

            mvm = new calendar.MonthViewModel(config);
            dayObj = mvm._getDayObject(
               new Date(2018, 0, 1),
               coreMerge({ daysData: daysData }, state, { preferSource: true })
            );

            expect(dayObj.extData.get('data')).toEqual(dayData.data);
         });

         it('should create correct lastDayOfMonth and firstDayOfMonth', function () {
            let mvm = new calendar.MonthViewModel(config);
            let lastDay = mvm._getDayObject(new Date(2019, 0, 31)),
               firstDay = mvm._getDayObject(new Date(2019, 0, 1)),
               middleDay = mvm._getDayObject(new Date(2019, 0, 10));

            expect(lastDay.lastDayOfMonth).toEqual(true);
            expect(lastDay.firstDayOfMonth).toEqual(false);

            expect(firstDay.lastDayOfMonth).toEqual(false);
            expect(firstDay.firstDayOfMonth).toEqual(true);

            expect(middleDay.lastDayOfMonth).toEqual(false);
            expect(middleDay.firstDayOfMonth).toEqual(false);
         });
      });
      describe('_isStateChanged', function () {
         it('should return true if new state the same', function () {
            let mvm = new calendar.MonthViewModel(config);
            expect(mvm._isStateChanged(config)).toBe(false);
         });

         it('should return false if new state contain changed daysData', function () {
            let mvm = new calendar.MonthViewModel(config);
            expect(
               mvm._isStateChanged(
                  coreMerge({ daysData: [2] }, config, { preferSource: true })
               )
            ).toBe(true);
         });
      });
   });
});
