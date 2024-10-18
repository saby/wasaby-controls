import { EIndicatorState, Indicator } from 'Controls/display';

describe('Controls/display/Indicator', () => {
    describe('setMetaData', () => {
        it('not displayed', () => {
            const indicator = new Indicator();
            indicator.setMetaData({});
            expect(indicator.getVersion()).toEqual(0);
        });

        it('is not portioned search', () => {
            const indicator = new Indicator();
            indicator.display(EIndicatorState.Loading);

            indicator.setMetaData({});

            expect(indicator.getVersion()).toEqual(1);
        });

        it('portioned search', () => {
            const indicator = new Indicator();
            indicator.display(EIndicatorState.PortionedSearch);
            indicator.setMetaData({});
            expect(indicator.getVersion()).toEqual(2);
        });

        it('continue search', () => {
            const indicator = new Indicator();
            indicator.display(EIndicatorState.ContinueSearch);
            indicator.setMetaData({});
            expect(indicator.getVersion()).toEqual(2);
        });
    });
});
