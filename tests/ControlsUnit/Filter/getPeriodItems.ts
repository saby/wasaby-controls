import { getPeriodItems, BY_PERIOD_TITLE, ON_DATE_TITLE } from 'Controls/filterDateRangeEditor';

describe('getPeriodItems', () => {
    describe('userPeriods', () => {
        it('add userPeriods without order', () => {
            const items = getPeriodItems({
                userPeriods: [
                    {
                        key: '1',
                        title: 'customItem',
                    },
                ],
            });
            expect(items.at(items.getCount() - 2).get('title')).toBe('customItem');
        });

        it('add userPeriods on first place', () => {
            const items = getPeriodItems({
                userPeriods: [
                    {
                        key: '1',
                        title: 'customItem',
                        order: 0,
                    },
                ],
            });
            expect(items.at(0).get('title')).toBe('customItem');
        });

        it('add userPeriods on second place', () => {
            const items = getPeriodItems({
                userPeriods: [
                    {
                        key: '1',
                        title: 'customItem',
                        order: 15,
                    },
                ],
            });
            expect(items.at(1).get('title')).toBe('customItem');
        });
    });
    describe('customPeriod', () => {
        it('there is custom period', () => {
            const items = getPeriodItems({});
            expect(items.at(items.getCount() - 1).get('title')).toBe(BY_PERIOD_TITLE);
        });

        it('there is custom period, single selection', () => {
            const items = getPeriodItems({ selectionType: 'single' });
            expect(items.at(items.getCount() - 1).get('title')).toBe(ON_DATE_TITLE);
        });

        it('no custom period', () => {
            const items = getPeriodItems({ customPeriod: false });
            expect(items.at(items.getCount() - 1).get('title') === BY_PERIOD_TITLE).toBeFalsy();
        });
    });
});
