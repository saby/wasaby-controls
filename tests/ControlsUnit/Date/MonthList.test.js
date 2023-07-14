define([
   'Core/core-merge',
   'Types/entity',
   'Types/collection',
   'Vdom/Vdom',
   'Controls/calendar',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils',
   'Controls/_calendar/MonthList/ExtDataModel',
   'Controls/_calendar/MonthList/ItemTypes',
   'Controls/_calendar/MonthList/MonthTemplate',
   'Controls/_calendar/MonthList/YearTemplate'
], function (
   coreMerge,
   entity,
   collection,
   vdom,
   calendar,
   DateUtil,
   calendarTestUtils,
   extDataModel,
   ItemTypes,
   MonthTemplate,
   YearTemplate
) {
   'use strict';
   let config = {
      position: new Date(2018, 0, 1),
      intersectionRatio: 0.5
   };

   // eslint-disable-next-line no-param-reassign
   ItemTypes = ItemTypes.default;

   describe('Controls/_calendar/MonthList', function () {
      describe('constructor', function () {
         it('default options', function () {
            let self = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               config
            );
            expect(self._itemTemplate).toBe(YearTemplate.default);
            expect(self._positionToScroll).toStrictEqual(config.position);
            expect(self._displayedPosition).toStrictEqual(config.position);
            expect(self._startPositionId).toStrictEqual('2018-01-01');
            expect(+self._lastNotifiedPositionChangedDate).toStrictEqual(
               +config.position
            );
         });

         it('viewMode = "year", position = 2020.03.01', function () {
            const position = new Date(2020, 2, 1),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  viewMode: 'year',
                  position: position
               });
            expect(self._positionToScroll).toStrictEqual(position);
            expect(self._displayedPosition).toStrictEqual(position);
            expect(self._startPositionId).toStrictEqual('2020-01-01');
            expect(+self._lastNotifiedPositionChangedDate).toStrictEqual(
               +new Date(2020, 0, 1)
            );
         });

         it('should render by month if viewMode is equals "month"', function () {
            let ml = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               coreMerge({ viewMode: 'month' }, config, { preferSource: true })
            );
            expect(ml._itemTemplate).toBe(MonthTemplate.default);
         });

         it('position option', function () {
            let position = new Date(2018, 0, 1),
               ml = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: position
               });
            expect(ml._positionToScroll).toEqual(position);
            expect(ml._displayedPosition).toEqual(position);
            expect(ml._startPositionId).toEqual('2018-01-01');
         });

         it('should initialize _extDataLastVersion if source option passed', function () {
            let control = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               coreMerge(config, { preferSource: true })
            );
            jest
               .spyOn(control, '_enrichItemsDebounced')
               .mockClear()
               .mockImplementation();
            expect(control._extDataLastVersion).toBe(
               control._extData.getVersion()
            );
            jest.restoreAllMocks();
         });

         it('with getInitialData', function () {
            jest
                .spyOn(extDataModel.default.prototype, 'updateData')
                .mockClear()
                .mockImplementation();

            let ml = calendarTestUtils.createComponentReact(
                calendar.MonthList, { source: { getInitialData: () => new collection.RecordSet() } }
            );

            expect(ml._extData.updateData).toHaveBeenCalledTimes(1);
            jest.restoreAllMocks();
         });
      });

      describe('componentDidMount', function () {
         it('load extData', function () {
            jest
                .spyOn(extDataModel.default.prototype, 'enrichItems')
                .mockClear()
                .mockResolvedValue(null);

            let ml = calendarTestUtils.createComponentReact(calendar.MonthList, { source: {} });
            ml.componentDidMount();

            expect(ml._extData.enrichItems).toHaveBeenCalledTimes(1);
            jest.restoreAllMocks();
         });

         it('should not reset lastPositionFromOptions if positionToScroll is different', function () {
            let control = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               { position: new Date(2017, 1, 1) }
            );

            jest
               .spyOn(control, '_canScroll')
               .mockClear()
               .mockReturnValue([true]);
            jest
               .spyOn(control, '_scrollToDate')
               .mockClear()
               .mockReturnValue(true);
            control._positionToScroll = new Date(2017, 1, 1);
            control._lastPositionFromOptions = new Date(2017, 2, 1);
            control._updateScrollAfterViewModification(false);
            expect(control._positionToScroll).toEqual(
               control._positionToScroll
            );
            jest.restoreAllMocks();
         });

         it('should reset lastPositionFromOptions if positionToScroll is not different', function () {
            let control = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               { position: new Date(2017, 1, 1) }
            );

            jest
               .spyOn(control, '_canScroll')
               .mockClear()
               .mockReturnValue([true]);
            jest
               .spyOn(control, '_scrollToDate')
               .mockClear()
               .mockReturnValue([true]);
            control._positionToScroll = new Date(2017, 1, 1);
            control._lastPositionFromOptions = new Date(2017, 1, 1);
            control._updateScrollAfterViewModification(false);
            expect(control._positionToScroll).toEqual(null);
            jest.restoreAllMocks();
         });
      });

      describe('shouldComponentUpdate', function () {
         it('should update position fields if position changed', function () {
            let position = new Date(2018, 0, 1),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: new Date(2017, 2, 3)
               });

            jest.spyOn(self, '_canScroll').mockClear().mockImplementation();
            jest.spyOn(self, '_isHidden').mockClear().mockReturnValue(false);
            self._listRef = { current: { reload: jest.fn() } };
            self._container = {};
            self._displayedDates = [1, 2];

            self.shouldComponentUpdate(
               calendarTestUtils.prepareOptions(calendar.MonthList, {
                  position: position
               })
            );
            expect(
               DateUtil.Base.isDatesEqual(self._positionToScroll, position)
            ).toBe(true);
            expect(self._displayedPosition).toStrictEqual(position);
            expect(self._startPositionId).toStrictEqual('2018-01-01');
            expect(Object.keys(self._displayedDates)).toHaveLength(0);
            jest.restoreAllMocks();
         });

         it('should not update _startPositionId field if item already rendered', function () {
            let position = new Date(2018, 0, 1),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: new Date(2017, 2, 3)
               });

            jest.spyOn(self, '_canScroll').mockClear().mockReturnValue([true]);
            jest.spyOn(self, '_findElementByDate').mockClear().mockReturnValue({
               closest: jest.fn()
            });
            self._listRef = { current: { reload: jest.fn() } };
            self._container = {};

            self.shouldComponentUpdate(
               calendarTestUtils.prepareOptions(calendar.MonthList, {
                  position: position
               })
            );
            expect(self._positionToScroll).toBeNull();
            expect(self._displayedPosition).toStrictEqual(position);
            expect(self._startPositionId).toStrictEqual('2017-01-01');
            expect(self._listRef.current.reload).not.toHaveBeenCalled();
            jest.restoreAllMocks();
         });

         it('should not update the position before the list is updated', function () {
            let position1 = new Date(2018, 0, 1),
               position2 = new Date(2019, 0, 1),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: new Date(2017, 2, 3)
               });

            jest.spyOn(self, '_canScroll').mockClear().mockReturnValue(false);
            jest.spyOn(self, '_isHidden').mockClear().mockReturnValue(false);
            jest
               .spyOn(self, '_findElementByDate')
               .mockClear()
               .mockReturnValue(null);
            self._listRef = { current: { reload: jest.fn() } };
            self._container = {};

            self.shouldComponentUpdate(
               calendarTestUtils.prepareOptions(calendar.MonthList, {
                  position: position1
               })
            );
            self.shouldComponentUpdate(
               calendarTestUtils.prepareOptions(calendar.MonthList, {
                  position: position2
               })
            );
            expect(+self._positionToScroll).toStrictEqual(+position1);
            expect(self._displayedPosition).toStrictEqual(position1);
            expect(self._lastPositionFromOptions).toStrictEqual(position2);
            expect(self._startPositionId).toStrictEqual('2018-01-01');
            jest.restoreAllMocks();
         });

         it('should scroll to position immediately without changing position if item already rendered', function () {
            let position1 = new Date(2018, 0, 1),
               position2 = new Date(2019, 0, 1),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: new Date(2017, 2, 3)
               });

            jest.spyOn(self, '_canScroll').mockClear().mockReturnValue(true);
            jest
               .spyOn(self, '_findElementByDate')
               .mockClear()
               .mockReturnValue(null);
            self._listRef = { current: { reload: jest.fn() } };
            self._container = {};

            self.shouldComponentUpdate(
               calendarTestUtils.prepareOptions(calendar.MonthList, {
                  position: position1
               })
            );
            self.shouldComponentUpdate(
               calendarTestUtils.prepareOptions(calendar.MonthList, {
                  position: position2
               })
            );
            expect(+self._positionToScroll).toStrictEqual(+position1);
            expect(self._displayedPosition).toStrictEqual(position1);
            expect(self._lastPositionFromOptions).toStrictEqual(position2);
            expect(self._startPositionId).toStrictEqual('2017-01-01');
            expect(self._listRef.current.reload).not.toHaveBeenCalled();
            jest.restoreAllMocks();
         });

         it('should update source if changed', function () {
            const oldSource = {
               query: function () {
                  return {
                     then: function () {
                        return 'source1';
                     }
                  };
               }
            };
            const newSource = {
               query: function () {
                  return {
                     then: function () {
                        return 'source2';
                     }
                  };
               }
            };
            const ml = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               {}
            );
            ml.shouldComponentUpdate({ source: oldSource });

            const stub = jest
               .spyOn(ml, '_enrichItems')
               .mockClear()
               .mockImplementation();
            ml._virtualPageSize = 3;
            ml._displayedPosition = new Date(2020, 0);
            ml.shouldComponentUpdate({ source: newSource });

            expect(stub).toHaveBeenCalledTimes(1);
         });
      });

      describe('componentDidUpdate', function () {
         it("should notify 'enrichItems' event if model has been changed", function () {
            const component = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               { ...config, onEnrichItems: jest.fn() }
            );

            jest
               .spyOn(component, '_enrichItemsDebounced')
               .mockClear()
               .mockImplementation();
            component._extData._nextVersion();
            component.componentDidUpdate();
            expect(component.props.onEnrichItems).toHaveBeenCalled();
            jest.restoreAllMocks();
         });

         it('should\'t notify "enrichItems" event if model has\'t been changed', function () {
            const component = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               { ...config, onEnrichItems: jest.fn() }
            );

            jest
               .spyOn(component, '_enrichItemsDebounced')
               .mockClear()
               .mockImplementation();
            component.componentDidUpdate();

            expect(component.props.onEnrichItems).not.toHaveBeenCalled();
            jest.restoreAllMocks();
         });
      });

      describe('_drawItemsHandler', function () {
         ['_drawItemsHandler'].forEach(function (test) {
            it('should scroll to item after position changed', function () {
               let position = new Date(2018, 0, 1),
                  ml = calendarTestUtils.createComponentReact(calendar.MonthList, {
                     position: new Date(2017, 2, 3)
                  });
               jest.spyOn(ml, '_canScroll').mockClear().mockReturnValue([true]);
               ml._container = {};
               jest.spyOn(ml, '_scrollToDate').mockClear().mockImplementation();
               ml.shouldComponentUpdate(
                  calendarTestUtils.prepareOptions(calendar.MonthList, {
                     position: position
                  })
               );
               ml[test]();
               expect(ml._scrollToDate).toHaveBeenCalled();
               jest.restoreAllMocks();
            });
         });
      });

      describe('_drawItemsHandler', function () {
         it('should set the position if the shouldComponentUpdate function has been called several times', function () {
            let position1 = new Date(2018, 0, 1),
               position2 = new Date(2019, 0, 1),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: new Date(2017, 2, 3)
               });
            jest.spyOn(self, '_canScroll').mockClear().mockReturnValue([true]);
            self._container = {};
            jest
               .spyOn(self, '_scrollToPosition')
               .mockClear()
               .mockImplementation();
            self.shouldComponentUpdate(
               calendarTestUtils.prepareOptions(calendar.MonthList, {
                  position: position1
               })
            );
            self.shouldComponentUpdate(
               calendarTestUtils.prepareOptions(calendar.MonthList, {
                  position: position2
               })
            );
            self._drawItemsHandler();
            expect(self._displayedPosition).toStrictEqual(position2);
            expect(self._scrollToPosition).toHaveBeenCalled();
            jest.restoreAllMocks();
         });
      });

      describe('_scrollToPosition', function () {
         it('should update position in the list and reload list if it cannot scroll', function () {
            let position = new Date(2018, 0, 1),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: position
               });
            jest.spyOn(self, '_canScroll').mockClear().mockReturnValue(false);
            jest.spyOn(self, '_isHidden').mockClear().mockReturnValue(false);
            self._listRef = { current: { reload: jest.fn() } };
            self._scrollToPosition(position);
            expect(Object.keys(self._displayedDates)).toHaveLength(0);
            expect(self._startPositionId).toStrictEqual('2018-01-01');
            expect(+self._lastNotifiedPositionChangedDate).toStrictEqual(
               +position
            );
            expect(self._listRef.current.reload).toHaveBeenCalled();
            jest.restoreAllMocks();
         });

         it('should not reload list if position changed, it will be changed on update hooks in list control.', function () {
            let position = new Date(2018, 0, 1),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: new Date(2019, 0, 1)
               });
            jest.spyOn(self, '_canScroll').mockClear().mockReturnValue(false);
            jest.spyOn(self, '_isHidden').mockClear().mockReturnValue(false);
            self._listRef = { current: { reload: jest.fn() } };
            self._scrollToPosition(position);
            expect(Object.keys(self._displayedDates)).toHaveLength(0);
            expect(self._startPositionId).toStrictEqual('2018-01-01');
            expect(self._listRef.current.reload).not.toHaveBeenCalled();
            jest.restoreAllMocks();
         });

         it('should scroll to days.', function () {
            let position = new Date(2018, 0, 2),
               self = calendarTestUtils.createComponentReact(calendar.MonthList, {
                  position: new Date(2019, 0, 1)
               });
            jest.spyOn(self, '_canScroll').mockClear().mockReturnValue(false);
            jest.spyOn(self, '_isHidden').mockClear().mockReturnValue(false);
            self._listRef = { current: { reload: jest.fn() } };
            self._scrollToPosition(position);
            expect(Object.keys(self._displayedDates)).toHaveLength(0);
            expect(self._startPositionId).toStrictEqual('2018-01-01');
            expect(self._positionToScroll).toStrictEqual(position);
            expect(+self._lastNotifiedPositionChangedDate).toStrictEqual(
               +new Date(2018, 0, 1)
            );
            expect(self._listRef.current.reload).not.toHaveBeenCalled();
            jest.restoreAllMocks();
         });
      });

      describe('_intersectHandler', function () {
         [
            {
               title: 'Should generate an event when the element appeared on top and half visible',
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 10, bottom: 30 },
                        rootBounds: { top: 20 }
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.body
                     }
                  }
               ],
               options: {},
               date: new Date(2019, 0)
            },
            {
               title: 'Should generate an event when the element appeared on top and the next one is half visible. viewMode: "year"',
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 50, bottom: 30 },
                        rootBounds: { top: 60 },
                        target: { offsetHeight: 50 }
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.body
                     }
                  }
               ],
               options: {},
               date: new entity.applied.Date(2020, 0)
            },
            {
               title: 'Should generate an event when the element appeared on top and the next one is half visible. viewMode: "month"',
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 50, bottom: 30 },
                        rootBounds: { top: 60 },
                        target: { offsetHeight: 50 }
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.body
                     }
                  }
               ],
               options: { viewMode: 'month' },
               date: new entity.applied.Date(2019, 1)
            },
            {
               title: 'Should generate an event when the 2 elements appeared on top and the next one is half visible. viewMode: "month"',
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 0, bottom: 30 },
                        rootBounds: { top: 55 },
                        target: { offsetHeight: 30 }
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.body
                     }
                  },
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 30, bottom: 50 },
                        rootBounds: { top: 55 },
                        target: { offsetHeight: 20 }
                     },
                     data: {
                        date: new Date(2019, 1),
                        type: ItemTypes.body
                     }
                  }
               ],
               options: { viewMode: 'month' },
               date: new entity.applied.Date(2019, 2)
            }
         ].forEach(function (test) {
            it(test.title, function () {
               const component = calendarTestUtils.createComponentReact(
                  calendar.MonthList,
                  coreMerge(test.options, { ...config, onPositionchanged: jest.fn() }, { preferSource: true })
               );
               const event = new vdom.SyntheticEvent(null, {
                  type: 'positionChanged',
               });

               component._intersectHandler(test.entries);
               expect(component.props.onPositionchanged).toHaveBeenCalledWith(
                  event,
                  test.date
               );
               jest.restoreAllMocks();
            });
         });

         it("Should't update position and displayed items if component invisible", function () {
            const component = calendarTestUtils.createComponentReact(
               calendar.MonthList,
               config
            );

            component._container = { offsetParent: null };
            jest
               .spyOn(component, '_updateDisplayedItems')
               .mockClear()
               .mockImplementation();
            jest
               .spyOn(component, '_updateDisplayedPosition')
               .mockClear()
               .mockImplementation();
            component._intersectHandler([{}, {}]);
            expect(component._updateDisplayedItems).not.toHaveBeenCalled();
            expect(component._updateDisplayedPosition).not.toHaveBeenCalled();
            jest.restoreAllMocks();
         });

         [
            {
               title: 'Should add date to displayed dates.',
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 10, bottom: 30 },
                        rootBounds: { top: 20 },
                        isIntersecting: true,
                        intersectionRatio: 0.5
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.body
                     }
                  }
               ],
               displayedDates: [],
               options: {
                  source: {
                     query: function () {
                        return {
                           then: jest.fn()
                        };
                     }
                  }
               },
               resultDisplayedDates: [new Date(2019, 0).getTime()],
               date: new Date(2019, 0)
            },
            {
               title: "Should't add date to displayed dates.",
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 10, bottom: 30 },
                        rootBounds: { top: 20 },
                        isIntersecting: true,
                        intersectionRatio: 0.05
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.body
                     }
                  }
               ],
               displayedDates: [],
               options: {
                  source: {
                     query: function () {
                        return {
                           then: jest.fn()
                        };
                     }
                  }
               },
               resultDisplayedDates: [],
               date: new Date(2019, 0)
            },
            {
               title: "Should't add date to displayed dates if header item is has been shown.",
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 10, bottom: 30 },
                        rootBounds: { top: 20 },
                        isIntersecting: true,
                        intersectionRatio: 0.5
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.header
                     }
                  }
               ],
               displayedDates: [],
               options: {
                  source: {
                     query: function () {
                        return {
                           then: jest.fn()
                        };
                     }
                  }
               },
               resultDisplayedDates: [],
               date: new Date(2019, 0)
            },
            {
               title: 'Should remove date from displayed dates.',
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 10, bottom: 30 },
                        rootBounds: { top: 20 },
                        isIntersecting: false
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.body
                     }
                  }
               ],
               displayedDates: [new Date(2019, 0).getTime(), 123],
               options: {
                  source: {
                     query: function () {
                        return {
                           then: jest.fn()
                        };
                     }
                  }
               },
               resultDisplayedDates: [123],
               date: new Date(2019, 0)
            },
            {
               title: "Should't remove date from displayed dates if header item is has been hidden.",
               entries: [
                  {
                     nativeEntry: {
                        boundingClientRect: { top: 10, bottom: 30 },
                        rootBounds: { top: 20 },
                        isIntersecting: false
                     },
                     data: {
                        date: new Date(2019, 0),
                        type: ItemTypes.header
                     }
                  }
               ],
               displayedDates: [new Date(2019, 0).getTime(), 123],
               options: {
                  source: {
                     query: function () {
                        return {
                           then: jest.fn()
                        };
                     }
                  }
               },
               resultDisplayedDates: [new Date(2019, 0).getTime(), 123],
               date: new Date(2019, 0)
            }
         ].forEach(function (test) {
            it(test.title, function () {
               const component = calendarTestUtils.createComponentReact(
                  calendar.MonthList, test.options
               );
               jest
                  .spyOn(component, '_updateSource')
                  .mockClear()
                  .mockImplementation();
               component._extData = {
                  enrichItems: function () {
                     return {
                        catch: jest.fn()
                     };
                  }
               };
               jest
                  .spyOn(component, '_enrichItemsDebounced')
                  .mockClear()
                  .mockImplementation();
               component._displayedDates = test.displayedDates;
               component._intersectHandler(test.entries);
               expect(component._displayedDates).toEqual(
                  test.resultDisplayedDates
               );
               jest.restoreAllMocks();
            });
         });
      });

      describe('_canScroll', function () {
         [
            {
               title: "should scroll if viewMode === 'year' and period is not the first month of the year",
               options: { viewMode: 'year' },
               date: new Date(2018, 3, 1),
               result: true
            }
         ].forEach(function (test) {
            it(test.title, function () {
               let control = calendarTestUtils.createComponentReact(
                     calendar.MonthList,
                     coreMerge(test.options, config, { preferSource: true })
                  ),
                  result;

               jest
                  .spyOn(control, '_findElementByDate')
                  .mockClear()
                  .mockReturnValue({});
               result = control._canScroll(test.date);
               if (test.result) {
                  expect(result).toBe(true);
               } else {
                  expect(result).toBe(false);
               }
               jest.restoreAllMocks();
            });
         });
      });

      describe('_findElementByDate', function () {
         const ITEM_BODY_SELECTOR = calendar.MonthList._ITEM_BODY_SELECTOR,
            returnAllPeriodTypes = function (selector) {
               return selector;
            },
            returnMonths = function (selector) {
               return selector === ITEM_BODY_SELECTOR.month ? selector : null;
            },
            returnYears = function (selector) {
               return selector === ITEM_BODY_SELECTOR.year ? selector : null;
            },
            returnMainTemplate = function (selector) {
               return selector === ITEM_BODY_SELECTOR.mainTemplate
                  ? selector
                  : null;
            };

         [
            {
               date: new Date(2020, 1, 2),
               getElementByDateStub: returnAllPeriodTypes,
               result: ITEM_BODY_SELECTOR.day
            },
            {
               date: new Date(2020, 1, 1),
               getElementByDateStub: returnAllPeriodTypes,
               result: ITEM_BODY_SELECTOR.month
            },
            {
               date: new Date(2020, 0, 1),
               getElementByDateStub: returnAllPeriodTypes,
               result: ITEM_BODY_SELECTOR.year
            },
            {
               date: new Date(2020, 1, 2),
               getElementByDateStub: returnMonths,
               result: ITEM_BODY_SELECTOR.month
            },
            {
               date: new Date(2020, 1, 2),
               getElementByDateStub: returnYears,
               result: ITEM_BODY_SELECTOR.year
            },
            {
               date: new Date(2020, 1, 2),
               getElementByDateStub: returnMainTemplate,
               result: ITEM_BODY_SELECTOR.mainTemplate
            }
         ].forEach(function (test, index) {
            it(`test ${index}`, function () {
               let control = calendarTestUtils.createComponentReact(
                  calendar.MonthList,
                  coreMerge(test.options, config, { preferSource: true })
               );

               jest
                  .spyOn(control, '_getElementByDate')
                  .mockClear()
                  .mockImplementation(test.getElementByDateStub);
               expect(control._findElementByDate(test.date)).toBe(test.result);
               jest.restoreAllMocks();
            });
         });
      });

      describe('_calculateInitialShadowVisibility', () => {
         [
            {
               displayedRanges: [[new Date(2019, 0), new Date(2022, 0)]],
               displayedPosition: new Date(2019, 0),
               position: 'top',
               result: 'auto'
            },
            {
               displayedRanges: [[new Date(2019, 0), new Date(2024, 0)]],
               displayedPosition: new Date(2022, 0),
               position: 'top',
               result: 'visible'
            },
            {
               displayedRanges: [[new Date(2019, 0), new Date(2022, 0)]],
               displayedPosition: new Date(2022, 0),
               position: 'bottom',
               result: 'auto'
            },
            {
               displayedRanges: [[new Date(2019, 0), new Date(2022, 0)]],
               displayedPosition: new Date(2019, 0),
               position: 'bottom',
               result: 'visible'
            }
         ].forEach((test, index) => {
            it(`should return correct shadowVisibility value ${index}`, () => {
               const control = calendarTestUtils.createComponentReact(
                  calendar.MonthList,
                  {}
               );
               control._displayedPosition = test.displayedPosition;
               const result = control._calculateInitialShadowVisibility(
                  test.displayedRanges,
                  test.position
               );
               expect(test.result).toEqual(result);
            });
         });
      });
   });
});
