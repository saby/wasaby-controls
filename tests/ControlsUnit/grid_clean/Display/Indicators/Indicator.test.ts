import Indicator from 'Controls/_grid/display/Indicator';
import * as Display from 'Controls/display';

describe('Controls/grid/Indicator', () => {
    describe('getTemplate', () => {
        it('is full grid support', () => {
            const indicator = new Indicator();
            expect(indicator.getTemplate('', null)).toEqual(
                'Controls/grid:IndicatorComponent'
            );
        });

        it('is not full grid support', () => {
            const stubIsFullGridSupport = jest
                .spyOn(Display, 'isFullGridSupport')
                .mockClear()
                .mockImplementation();
            stubIsFullGridSupport.mockReturnValue(false);

            const indicator = new Indicator();
            expect(indicator.getTemplate('', null)).toEqual(
                'Controls/gridIE:IndicatorComponent'
            );

            jest.restoreAllMocks();
        });
    });
});
