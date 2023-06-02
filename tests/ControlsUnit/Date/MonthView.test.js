define([
   'Core/core-merge',
   'Controls/calendar',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils'
], function (coreMerge, calendar, DateUtil, calendarTestUtils) {
   'use strict';

   let config = {
      month: new Date(2017, 0, 1),
      showCaption: true,
      // eslint-disable-next-line no-empty-function
      onItemclick: () => {},
      // eslint-disable-next-line no-empty-function
      onItemmouseenter: () => {}
   };

   describe('Controls/Date/MonthView', function () {
      describe('Initialisation', function () {
         it('should create the correct model for the month when creating', function () {
            let mv, weeks;

            mv = calendarTestUtils.createComponentReact(
               calendar.MonthView,
               config
            );

            expect(mv._caption).toBe("Январь'17");

            weeks = mv._monthViewModel.getMonthArray();

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

      describe('_dayClickHandler', function () {
         it('should generate "itemClick" event', function () {
            let mv = calendarTestUtils.createComponentReact(
                  calendar.MonthView,
                  config
               ),
               item = 'item',
               event = 'event';

            jest
               .spyOn(mv.props, 'onItemclick')
               .mockClear()
               .mockImplementation();
            [
               {
                  isCurrentMonth: false,
                  mode: 'extended'
               },
               {
                  isCurrentMonth: true,
                  mode: 'current'
               }
            ].forEach(function (test) {
               mv._dayClickHandler(event, item, test.mode, test.isCurrentMonth);
               expect(mv.props.onItemclick).toHaveBeenCalledWith(
                  event,
                  item,
                  event,
                  false
               );
            });
         });

         it('should\'t generate "itemClick" event', function () {
            let mv = calendarTestUtils.createComponentReact(
                  calendar.MonthView,
                  config
               ),
               item = 'item',
               clickable = false;

            jest
               .spyOn(mv.props, 'onItemclick')
               .mockClear()
               .mockImplementation();
            mv._dayClickHandler({}, item, clickable);

            expect(mv.props.onItemclick).not.toHaveBeenCalled();
         });

         it('should\'t generate "itemClick" event in readOnly mode', function () {
            let item = 'item',
               mv = calendarTestUtils.createComponentReact(
                  calendar.MonthView,
                  coreMerge({ readOnly: true }, config, { preferSource: true })
               );

            jest
               .spyOn(mv.props, 'onItemclick')
               .mockClear()
               .mockImplementation();
            mv._dayClickHandler({}, item);

            expect(mv.props.onItemclick).not.toHaveBeenCalled();
         });
      });

      describe('_mouseEnterHandler', function () {
         [
            {
               title: 'mode=current, month is current',
               isCurrentMonth: true,
               mode: 'current'
            },
            {
               title: 'mode=extended, month is not current',
               isCurrentMonth: false,
               mode: 'extended'
            }
         ].forEach((test) => {
            it(
               'should generate "itemMouseEnter" event. ' + test.title,
               function () {
                  let item = 'item',
                     mv = calendarTestUtils.createComponentReact(
                        calendar.MonthView,
                        { ...config, mode: test.mode }
                     );

                  jest
                     .spyOn(mv.props, 'onItemmouseenter')
                     .mockClear()
                     .mockImplementation();
                  mv._mouseEnterHandler({}, item, test.isCurrentMonth);
                  expect(mv.props.onItemmouseenter).toHaveBeenCalledWith(
                     {},
                     item
                  );
               }
            );
         });

         it('should\'t generate "itemMouseEnter" event', function () {
            let item = 'item',
               mv = calendarTestUtils.createComponentReact(
                  calendar.MonthView,
                  config
               );

            jest
               .spyOn(mv.props, 'onItemmouseenter')
               .mockClear()
               .mockImplementation();

            mv._mouseEnterHandler({}, item, false);
            expect(mv.props.onItemmouseenter).not.toHaveBeenCalled();
         });
      });

      describe('_updateView', function () {
         it('should update month and month caption when month changed', function () {
            const mv = calendarTestUtils.createComponentReact(
                  calendar.MonthView,
                  config
               ),
               month = new Date(2018, 4, 1);
            mv._updateView(Object.assign({}, mv.props, { month: month }));
            expect(mv._month.getTime()).toEqual(month.getTime());
            expect(mv._caption).toBe("Май'18");
         });

         it('should not update month if month did not changed', function () {
            const mv = calendarTestUtils.createComponentReact(
               calendar.MonthView,
               config
            );
            mv._updateView(
               Object.assign({}, config, { month: new Date(config.month) })
            );
            expect(mv._month.getTime()).toBe(config.month.getTime());
         });
      });
   });
});
