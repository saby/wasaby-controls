import MonthsSource from 'Controls/_calendar/MonthList/MonthsSource';
import { Query } from 'Types/source';
import monthListUtils from 'Controls/_calendar/MonthList/Utils';
import ITEM_TYPES from 'Controls/_calendar/MonthList/ItemTypes';
import { Base as dateUtils } from 'Controls/dateUtils';

describe('Controls/_calendar/MonthList/MonthsSource', () => {
    describe('query', () => {
        const LIMIT = 2;
        [
            {
                options: { viewMode: 'month' },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2019, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2019, 0)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 1)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: { viewMode: 'month', header: true },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2019, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2019, 0)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: 'h' + monthListUtils.dateToId(new Date(2019, 1)),
                        type: ITEM_TYPES.header,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 1)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: 'h' + monthListUtils.dateToId(new Date(2019, 2)),
                        type: ITEM_TYPES.header,
                    },
                ],
            },
            {
                options: { viewMode: 'month' },
                query: new Query().where({
                    'id>=': monthListUtils.dateToId(new Date(2019, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2019, 1)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 2)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: { viewMode: 'month', header: true },
                query: new Query().where({
                    'id>=': 'h' + monthListUtils.dateToId(new Date(2019, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2019, 0)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: 'h' + monthListUtils.dateToId(new Date(2019, 1)),
                        type: ITEM_TYPES.header,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 1)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: 'h' + monthListUtils.dateToId(new Date(2019, 2)),
                        type: ITEM_TYPES.header,
                    },
                ],
            },
            {
                options: { viewMode: 'month' },
                query: new Query().where({
                    'id<=': monthListUtils.dateToId(new Date(2019, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 10)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2018, 11)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: { viewMode: 'month', header: true },
                query: new Query().where({
                    'id<=': monthListUtils.dateToId(new Date(2019, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 10)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: 'h' + monthListUtils.dateToId(new Date(2018, 11)),
                        type: ITEM_TYPES.header,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2018, 11)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: 'h' + monthListUtils.dateToId(new Date(2019, 0)),
                        type: ITEM_TYPES.header,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                    viewMode: 'month',
                    stubTemplate: 'template',
                },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2018, 11)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 11)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 0)),
                        type: ITEM_TYPES.stub,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id<=': monthListUtils.dateToId(new Date(2018, 11)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 9)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2018, 10)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2018, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 0)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2018, 1)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id>=': monthListUtils.dateToId(new Date(2018, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 1)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2018, 2)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2018, 0), new Date(2018, 11)]],
                    viewMode: 'month',
                    stubTemplate: 'template',
                },
                query: new Query().where({
                    'id<=': monthListUtils.dateToId(new Date(2018, 0)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2017, 11)),
                        type: ITEM_TYPES.stub,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [
                        [new Date(2018, 0), new Date(2018, 6)],
                        [new Date(2019, 0), new Date(2019, 6)],
                    ],
                    viewMode: 'month',
                    stubTemplate: 'template',
                },
                limit: 3,
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2018, 6)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 6)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2018, 7)),
                        type: ITEM_TYPES.stub,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 0)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2018, 0), new Date(2018, 6)]],
                    viewMode: 'month',
                    stubTemplate: 'template',
                },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2017, 6)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2017, 11)),
                        type: ITEM_TYPES.stub,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2018, 0)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2018, 0), new Date(2018, 6)]],
                    viewMode: 'month',
                    stubTemplate: 'template',
                },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2019, 6)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 7)),
                        type: ITEM_TYPES.stub,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[null, new Date(2018, 11)]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2017, 10)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2017, 10)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2017, 11)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[null, new Date(2018, 11)]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id>=': monthListUtils.dateToId(new Date(2017, 10)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2017, 11)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2017, 12)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[null, new Date(2018, 11)]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id<=': monthListUtils.dateToId(new Date(2017, 10)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2017, 8)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2017, 9)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2019, 0), null]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2019, 6)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2019, 6)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 7)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2019, 0), null]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id>=': monthListUtils.dateToId(new Date(2019, 6)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2019, 7)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 8)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2019, 0), null]],
                    viewMode: 'month',
                },
                query: new Query().where({
                    'id<=': monthListUtils.dateToId(new Date(2019, 6)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2019, 4)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 5)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2019, 0), new Date(2019, 3)]],
                    viewMode: 'month',
                    monthHeaderTemplate: {},
                },
                query: new Query().where({
                    'id>=': monthListUtils.dateToId(new Date(2019, 2)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2019, 3)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [
                        [new Date(2018, 0), new Date(2018, 6)],
                        [new Date(2019, 0), new Date(2019, 6)],
                    ],
                    viewMode: 'month',
                },
                limit: 3,
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2018, 6)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 6)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 0)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
            {
                options: {
                    displayedRanges: [[new Date(2018, 0), new Date(2019, 0)]],
                },
                query: new Query().where({
                    'id~': monthListUtils.dateToId(new Date(2018, 3)),
                }),
                resp: [
                    {
                        id: monthListUtils.dateToId(new Date(2018, 0)),
                        type: ITEM_TYPES.body,
                    },
                    {
                        id: monthListUtils.dateToId(new Date(2019, 0)),
                        type: ITEM_TYPES.body,
                    },
                ],
            },
        ].forEach((test, i) => {
            it(`should return proper data ${i}`, () => {
                const source = new MonthsSource(test.options);

                return source
                    .query(test.query.limit(test.limit || LIMIT))
                    .then((resp) => {
                        resp = resp.getAll().getRawData();
                        expect(resp.length).toBe(test.resp.length);
                        resp.forEach((item, idx) => {
                            expect(item.id).toBe(test.resp[idx].id);
                            expect(item.type).toBe(test.resp[idx].type);
                        });
                    });
            });
        });

        it('should return meta data where "before" is false', () => {
            const options = {
                displayedRanges: [[new Date(2018, 0), new Date(2019, 0)]],
                order: 'asc',
            };
            const source = new MonthsSource(options);

            const query = new Query().where({
                'id~': monthListUtils.dateToId(new Date(2018, 0)),
            });

            return source.query(query.limit(LIMIT)).then((resp) => {
                const before = resp.getMetaData().total.before;
                expect(before).toBe(false);
            });
        });

        [
            {
                displayedRanges: [[new Date(2015, 0), new Date(2019, 0)]],
                order: 'asc',
            },
            {
                displayedRanges: [
                    [new Date(2015, 0), new Date(2017, 0)],
                    [new Date(2018, 0), new Date(2019, 0)],
                ],
                order: 'asc',
            },
            {
                displayedRanges: [[new Date(2018, 0), null]],
                order: 'desc',
            },
        ].forEach((test, index) => {
            it(
                'should return meta data where "before" is true ' + index,
                () => {
                    const source = new MonthsSource(test);

                    const query = new Query().where({
                        'id~': monthListUtils.dateToId(new Date(2018, 3)),
                    });

                    return source.query(query.limit(LIMIT)).then((resp) => {
                        const before = resp.getMetaData().total.before;
                        expect(before).toBe(true);
                    });
                }
            );
        });
    });

    describe('_getDefaultDisplayedRanges', () => {
        it('should return correct default displayedRanges', () => {
            const source = new MonthsSource({});
            const result = source._getDefaultDisplayedRanges();
            const lastMonth = 11;
            const defaultDisplayedRanges = [
                [
                    new Date(dateUtils.MIN_YEAR_VALUE, 0),
                    new Date(dateUtils.MAX_YEAR_VALUE, lastMonth),
                ],
            ];
            expect(
                dateUtils.isDatesEqual(
                    result[0][0],
                    defaultDisplayedRanges[0][0]
                )
            ).toBe(true);
            expect(
                dateUtils.isDatesEqual(
                    result[0][1],
                    defaultDisplayedRanges[0][1]
                )
            ).toBe(true);
        });
    });
});
