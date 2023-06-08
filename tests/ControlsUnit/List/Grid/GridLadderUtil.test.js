define([
   'Types/collection',
   'Controls/display',
   'Env/Env',
   'Controls/grid',
   'Controls/treeGrid'
], function (Collection, Display, Env, Grid, TreeGrid) {
   const Util = Display.GridLadderUtil;

   describe('Controls/display:GridLadderUtil', function () {
      it('isSupportLadder', function () {
         expect(Util.isSupportLadder(undefined)).toBe(false);
         expect(Util.isSupportLadder([])).toBe(false);
         expect(Util.isSupportLadder(['photo'])).toBe(true);
      });
      it('getStickyColumn', function () {
         expect(Util.getStickyColumn({})).toEqual(undefined);
         expect(
            Util.getStickyColumn({
               stickyColumn: { index: 1, property: 'sticky' }
            })
         ).toEqual({ index: 1, property: ['sticky'] });
         expect(
            Util.getStickyColumn({
               stickyColumn: { index: 1, property: 'sticky' },
               columns: []
            })
         ).toEqual({ index: 1, property: ['sticky'] });
         expect(
            Util.getStickyColumn({
               stickyColumn: { index: 1, property: 'sticky' },
               columns: [{ title: 'photo' }]
            })
         ).toEqual({ index: 1, property: ['sticky'] });
         expect(
            Util.getStickyColumn({
               stickyColumn: { index: 1, property: 'sticky' },
               columns: [{ title: 'photo', stickyProperty: 'photo' }]
            })
         ).toEqual({ index: 1, property: ['sticky'] });
         expect(
            Util.getStickyColumn({
               columns: [{ title: 'photo', stickyProperty: 'photo' }]
            })
         ).toEqual({ index: 0, property: ['photo'] });
         expect(
            Util.getStickyColumn({
               columns: [
                  { title: 'title' },
                  { title: 'photo', stickyProperty: 'photo' }
               ]
            })
         ).toEqual({ index: 1, property: ['photo'] });
      });
      it('shouldAddStickyLadderCell', function () {
         expect(Util.shouldAddStickyLadderCell()).toBe(false);
         expect(Util.shouldAddStickyLadderCell([])).toBe(false);
         expect(
            Util.shouldAddStickyLadderCell([], { index: 1, property: 'sticky' })
         ).toBe(true);
         expect(
            Util.shouldAddStickyLadderCell([{ title: 'photo' }], {
               index: 1,
               property: 'sticky'
            })
         ).toBe(true);
         expect(
            Util.shouldAddStickyLadderCell([
               { title: 'photo', stickyProperty: 'photo' }
            ])
         ).toBe(true);
         expect(
            Util.shouldAddStickyLadderCell(
               [{ title: 'photo', stickyProperty: 'photo' }],
               undefined,
               {}
            )
         ).toBe(false);
      });
      it('stickyLadderCellsCount', function () {
         expect(Util.stickyLadderCellsCount()).toBe(0);
         expect(Util.stickyLadderCellsCount([])).toBe(0);
         expect(
            Util.stickyLadderCellsCount([], { index: 1, property: 'sticky' })
         ).toBe(1);
         expect(
            Util.stickyLadderCellsCount([{ title: 'photo' }], {
               index: 1,
               property: 'sticky'
            })
         ).toBe(1);
         expect(
            Util.stickyLadderCellsCount([
               { title: 'photo', stickyProperty: 'photo' }
            ])
         ).toBe(1);
         expect(
            Util.stickyLadderCellsCount([
               { title: 'photo', stickyProperty: ['date', 'time'] }
            ])
         ).toBe(2);
         expect(
            Util.stickyLadderCellsCount(
               [{ title: 'photo', stickyProperty: 'photo' }],
               undefined,
               {}
            )
         ).toBe(0);
         Env.detection.isNotFullGridSupport = true;
         expect(
            Util.stickyLadderCellsCount([
               { title: 'photo', stickyProperty: ['date', 'time'] }
            ])
         ).toBe(0);
         Env.detection.isNotFullGridSupport = false;
      });
      it('prepareLadder', function () {
         const date1 = new Date(2017, 0, 1);
         const date2 = new Date(2017, 0, 3);
         const date3 = new Date(2017, 0, 5);
         const date4 = new Date(2017, 0, 7);
         const date5 = new Date(2017, 0, 9);
         const items = new Collection.RecordSet({
            keyProperty: 'key',
            rawData: [
               {
                  key: 0,
                  title: 'i0',
                  date: date1,
                  photo: '1.png'
               },
               {
                  key: 1,
                  title: 'i1',
                  date: date2,
                  photo: '1.png'
               },
               {
                  key: 2,
                  title: 'i2',
                  date: date2,
                  photo: '1.png'
               },
               {
                  key: 3,
                  title: 'i3',
                  date: date2,
                  photo: '2.png'
               },
               {
                  key: 4,
                  title: 'i4',
                  date: date3,
                  photo: '3.png'
               },
               {
                  key: 5,
                  title: 'i5',
                  date: date3,
                  photo: '3.png'
               },
               {
                  key: 6,
                  title: 'i6',
                  date: date4,
                  photo: '3.png'
               },
               {
                  key: 7,
                  title: 'i7',
                  date: date5,
                  photo: '3.png'
               },
               {
                  key: 8,
                  title: 'i8',
                  date: date5,
                  photo: '4.png'
               },
               {
                  key: 9,
                  title: 'i9',
                  date: date5,
                  photo: '5.png'
               }
            ]
         });
         const columns = [
            {
               width: '1fr',
               displayProperty: 'title'
            },
            {
               width: '1fr',
               template: 'wml!MyTestDir/Photo',
               stickyProperty: 'photo'
            }
         ];
         const resultLadder = {
            0: { date: { ladderLength: 1 } },
            1: { date: { ladderLength: 3 } },
            2: { date: {} },
            3: { date: {} },
            5: { date: { ladderLength: 1 } },
            6: { date: { ladderLength: 1 } },
            7: { date: { ladderLength: 3 } },
            8: { date: {} },
            9: { date: {} }
         };
         const resultStickyLadder = {
            0: {
               photo: {
                  ladderLength: 3,
                  headingStyle: 'grid-row: span 3'
               }
            },
            1: {
               photo: {}
            },
            2: {
               photo: {}
            },
            3: {
               photo: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               }
            },
            5: {
               photo: {
                  headingStyle: 'grid-row: span 3',
                  ladderLength: 3
               }
            },
            6: {
               photo: {}
            },
            7: {
               photo: {}
            },
            8: {
               photo: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               }
            },
            9: {
               photo: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               }
            }
         };

         const display = new Grid.GridCollection({
            collection: items,
            columns: columns,
            keyProperty: 'id',
            itemEditorTemplate: 'tmpl'
         });
         display.getItemBySourceKey(4).setEditing(true);

         const ladder = Util.prepareLadder({
            display,
            columns: columns,
            ladderProperties: ['date'],
            startIndex: 0,
            stopIndex: 10
         });
         expect(ladder.ladder).toEqual(resultLadder);
         expect(ladder.stickyLadder).toEqual(resultStickyLadder);
      });

      it('prepareLadder with wrong stop index', function () {
         const date1 = new Date(2017, 0, 1);
         const date2 = new Date(2017, 0, 3);
         const date3 = new Date(2017, 0, 5);
         const date4 = new Date(2017, 0, 7);
         const date5 = new Date(2017, 0, 9);
         const items = new Collection.RecordSet({
            keyProperty: 'key',
            rawData: [
               {
                  key: 0,
                  title: 'i0',
                  date: date1,
                  photo: '1.png'
               },
               {
                  key: 1,
                  title: 'i1',
                  date: date2,
                  photo: '1.png'
               },
               {
                  key: 2,
                  title: 'i2',
                  date: date2,
                  photo: '1.png'
               },
               {
                  key: 3,
                  title: 'i3',
                  date: date2,
                  photo: '2.png'
               },
               {
                  key: 4,
                  title: 'i4',
                  date: date3,
                  photo: '3.png'
               },
               {
                  key: 5,
                  title: 'i5',
                  date: date3,
                  photo: '3.png'
               },
               {
                  key: 6,
                  title: 'i6',
                  date: date4,
                  photo: '3.png'
               },
               {
                  key: 7,
                  title: 'i7',
                  date: date5,
                  photo: '3.png'
               },
               {
                  key: 8,
                  title: 'i8',
                  date: date5,
                  photo: '4.png'
               }
            ]
         });
         const columns = [
            {
               width: '1fr',
               displayProperty: 'title'
            },
            {
               width: '1fr',
               template: 'wml!MyTestDir/Photo',
               stickyProperty: 'photo'
            }
         ];
         const resultLadder = {
            0: { date: { ladderLength: 1 } },
            1: { date: { ladderLength: 3 } },
            2: { date: {} },
            3: { date: {} },
            5: { date: { ladderLength: 1 } },
            6: { date: { ladderLength: 1 } },
            7: { date: { ladderLength: 2 } },
            8: { date: {} }
         };
         const resultStickyLadder = {
            0: {
               photo: {
                  ladderLength: 3,
                  headingStyle: 'grid-row: span 3'
               }
            },
            1: {
               photo: {}
            },
            2: {
               photo: {}
            },
            3: {
               photo: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               }
            },
            5: {
               photo: {
                  headingStyle: 'grid-row: span 3',
                  ladderLength: 3
               }
            },
            6: {
               photo: {}
            },
            7: {
               photo: {}
            },
            8: {
               photo: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               }
            }
         };

         const display = new Grid.GridCollection({
            collection: items,
            columns: columns,
            keyProperty: 'id',
            itemEditorTemplate: 'tmpl'
         });
         display.getItemBySourceKey(4).setEditing(true);
         try {
            const ladder = Util.prepareLadder({
               display,
               columns: columns,
               ladderProperties: ['date'],
               startIndex: 0,
               stopIndex: 10
            });
            expect(ladder.ladder).toEqual(resultLadder);
            expect(ladder.stickyLadder).toEqual(resultStickyLadder);
         } catch (error) {
            throw new Error(error.message);
         }
      });
      it('prepareLadder. first field must split second', () => {
         const items = new Collection.RecordSet({
            keyProperty: 'key',
            rawData: [
               {
                  key: 0,
                  title: 'i0',
                  first: 1,
                  second: 1
               },
               {
                  key: 1,
                  title: 'i1',
                  first: 2,
                  second: 1
               },
               {
                  key: 2,
                  title: 'i2',
                  first: 3,
                  second: 2
               },
               {
                  key: 3,
                  title: 'i3',
                  first: 3,
                  second: 2
               }
            ]
         });
         const columns = [
            {
               width: '1fr',
               displayProperty: 'title',
               stickyProperty: ['first', 'second']
            }
         ];
         const resultLadder = {
            0: {
               first: {
                  ladderLength: 1
               },
               second: {
                  ladderLength: 1
               }
            },
            1: {
               first: {
                  ladderLength: 1
               },
               second: {
                  ladderLength: 1
               }
            },
            2: {
               first: {
                  ladderLength: 2
               },
               second: {
                  ladderLength: 2
               }
            },
            3: {
               first: {},
               second: {}
            }
         };
         const resultStickyLadder = {
            0: {
               first: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               },
               second: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               }
            },
            1: {
               first: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               },
               second: {
                  ladderLength: 1,
                  headingStyle: 'grid-row: span 1'
               }
            },
            2: {
               first: {
                  ladderLength: 2,
                  headingStyle: 'grid-row: span 2'
               },
               second: {
                  ladderLength: 2,
                  headingStyle: 'grid-row: span 2'
               }
            },
            3: {
               first: {},
               second: {}
            }
         };

         const display = new Grid.GridCollection({
            collection: items,
            columns: columns,
            keyProperty: 'id'
         });
         const ladder = Util.prepareLadder({
            display,
            columns: columns,
            ladderProperties: ['first', 'second'],
            startIndex: 0,
            stopIndex: 4
         });

         expect(ladder.ladder).toEqual(resultLadder);
         expect(ladder.stickyLadder).toEqual(resultStickyLadder);
      });

      it('should return z-index styles for sticky column', () => {
         const items = new Collection.RecordSet({
            keyProperty: 'key',
            rawData: [
               {
                  key: 0,
                  title: 'i0',
                  first: 1,
                  second: 1
               },
               {
                  key: 1,
                  title: 'i1',
                  first: 2,
                  second: 1
               },
               {
                  key: 2,
                  title: 'i2',
                  first: 3,
                  second: 2
               },
               {
                  key: 3,
                  title: 'i3',
                  first: 3,
                  second: 2
               }
            ]
         });
         const columns = [
            {
               width: '1fr',
               displayProperty: 'title',
               stickyProperty: ['first', 'second']
            }
         ];
         const display = new Grid.GridCollection({
            collection: items,
            columns: columns,
            keyProperty: 'id'
         });
         const ladder = Util.prepareLadder({
            display,
            columns: columns,
            ladderProperties: ['first', 'second'],
            startIndex: 0,
            stopIndex: 4,
            hasColumnScroll: true
         });

         expect(ladder.stickyLadder[0].first.headingStyle).toEqual(
            'grid-row: span 1; z-index: 4;'
         );
      });
      it('ladder through nodeFooter', () => {
         const recordSet = new Collection.RecordSet({
            keyProperty: 'key',
            rawData: [
               {
                  key: 1,
                  parent: null,
                  type: true,
                  title: '1',
                  first: 1
               },
               {
                  key: 11,
                  parent: 1,
                  type: null,
                  title: '11',
                  first: 1
               },
               {
                  key: 2,
                  parent: null,
                  type: null,
                  title: '2',
                  first: 1
               },
               {
                  key: 3,
                  parent: null,
                  type: null,
                  title: '3',
                  first: 2
               }
            ]
         });
         const columns = [
            {
               width: '1fr',
               displayProperty: 'title',
               stickyProperty: ['first']
            }
         ];
         const display = new TreeGrid.TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            expandedItems: [null],
            nodeFooterTemplate: () => {
               return '';
            }
         });
         const ladder = Util.prepareLadder({
            display,
            columns: columns,
            ladderProperties: ['first'],
            startIndex: 0,
            stopIndex: 5,
            hasColumnScroll: true
         });
         const resultLadder = {
            0: {
               first: {
                  ladderLength: 4
               }
            },
            1: {
               first: {}
            },
            2: {
               first: {}
            },
            3: {
               first: {}
            },
            4: {
               first: {
                  ladderLength: 1
               }
            }
         };

         expect(ladder.ladder).toEqual(resultLadder);
      });
      it('nodeFooter on edge of ladder steps', () => {
         const recordSet = new Collection.RecordSet({
            keyProperty: 'key',
            rawData: [
               {
                  key: 1,
                  parent: null,
                  type: true,
                  title: '1',
                  first: 1
               },
               {
                  key: 11,
                  parent: 1,
                  type: null,
                  title: '11',
                  first: 1
               },
               {
                  key: 2,
                  parent: null,
                  type: null,
                  title: '2',
                  first: 2
               },
               {
                  key: 3,
                  parent: null,
                  type: null,
                  title: '3',
                  first: 2
               }
            ]
         });
         const columns = [
            {
               width: '1fr',
               displayProperty: 'title',
               stickyProperty: ['first']
            }
         ];
         const display = new TreeGrid.TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            expandedItems: [null],
            nodeFooterTemplate: () => {
               return '';
            }
         });
         const ladder = Util.prepareLadder({
            display,
            columns: columns,
            ladderProperties: ['first'],
            startIndex: 0,
            stopIndex: 5,
            hasColumnScroll: true
         });
         const resultLadder = {
            0: {
               first: {
                  ladderLength: 2
               }
            },
            1: {
               first: {}
            },
            2: {
               first: {
                  ladderLength: 1
               }
            },
            3: {
               first: {
                  ladderLength: 2
               }
            },
            4: {
               first: {}
            }
         };

         expect(ladder.ladder).toEqual(resultLadder);
      });
   });
});
