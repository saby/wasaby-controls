import { getColorIndex } from 'Controls-Graphs/_RoundChart/utils/getColorIndex';
import { getChartConfig } from 'Controls-Graphs/_RoundChart/utils/getChartConfig';
import { TEST_DATA, TEST_SERIES, BASE_CONFIG } from './TestData';

describe('Controls-Graphs/RoundChart', () => {
    it('func = getColorIndex', () => {
        expect('base-1').toEqual(getColorIndex(undefined, 1, false));
        expect('base-2').toEqual(getColorIndex(undefined, 2, false));
        expect('base-3').toEqual(getColorIndex(undefined, 3, false));

        expect('base-1000').toEqual(getColorIndex(1000, 1, false));
        expect('base-1001').toEqual(getColorIndex(1001, 2, false));
        expect('base-1002').toEqual(getColorIndex(1002, 3, false));

        expect('base-0').toEqual(getColorIndex(1000, 1, true));
        expect('base-0').toEqual(getColorIndex(2112, 2, true));
        expect('base-0').toEqual(getColorIndex(null, 3, true));
    });
    it('func = getGlobalConfig, base', () => {
        const result = getChartConfig({ data: TEST_DATA, series: TEST_SERIES, animation: true });
        // @ts-expect-error
        result.tooltip.formatter = null;
        expect(BASE_CONFIG).toEqual(result);
    });
});
