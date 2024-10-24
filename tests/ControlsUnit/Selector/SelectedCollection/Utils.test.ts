import {
    getItemMaxWidth,
    getVisibleItems,
    getItemGridRowStyles,
    getItemGridColumnStyles,
} from 'Controls/_lookup/SelectedCollection/Utils';
import { RecordSet } from 'Types/collection';

describe('Controls/_lookup/SelectedCollection/Utils', () => {
    it('getItemMaxWidth', () => {
        expect(getItemMaxWidth(0, 4, 1, 'oneRow', 20)).toBeUndefined();
        expect(getItemMaxWidth(0, 4, 2, 'oneRow', 20)).toBeUndefined();
        expect(getItemMaxWidth(0, 4, 2, 'default', 30)).toBe('calc(100% - 30px)');
        expect(getItemMaxWidth(1, 4, 2, 'default', 30)).toBeUndefined();
    });
    it('getItemMaxWidth', () => {
        const rs = new RecordSet({
            rawData: [
                {
                    id: 0,
                },
                {
                    id: 1,
                },
                {
                    id: 2,
                },
                {
                    id: 3,
                },
            ],
            keyProperty: 'id',
        });
        expect(getVisibleItems({ items: rs })).toHaveLength(4);
        expect(getVisibleItems({ items: rs, maxVisibleItems: 2 })).toHaveLength(2);
        expect(
            getVisibleItems({
                items: rs,
                maxVisibleItems: 2,
                itemsLayout: 'twoColumns',
            })
        ).toHaveLength(4);
    });
    it('getItemGridRowStyles', () => {
        expect(getItemGridRowStyles(0, 'twoColumns')).toEqual({ msGridRow: '1', gridRow: '1' });
        expect(getItemGridRowStyles(1, 'twoColumns')).toEqual({ msGridRow: '1', gridRow: '1' });
        expect(getItemGridRowStyles(2, 'twoColumns')).toEqual({ msGridRow: '2', gridRow: '2' });
        expect(getItemGridRowStyles(3, 'twoColumns')).toEqual({ msGridRow: '2', gridRow: '2' });
        expect(getItemGridRowStyles(0, 'default')).toBe(null);
    });
    it('getItemGridColumnStyles', () => {
        expect(getItemGridColumnStyles(0, 'twoColumns')).toEqual({
            msGridColumn: '1',
            gridColumn: '1',
        });
        expect(getItemGridColumnStyles(1, 'twoColumns')).toEqual({
            msGridColumn: '2',
            gridColumn: '2',
        });
        expect(getItemGridColumnStyles(2, 'twoColumns')).toEqual({
            msGridColumn: '1',
            gridColumn: '1',
        });
        expect(getItemGridColumnStyles(3, 'twoColumns')).toEqual({
            msGridColumn: '2',
            gridColumn: '2',
        });
        expect(getItemGridColumnStyles(0, 'default')).toBe(null);
    });
});
