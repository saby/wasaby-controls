import { StepBar } from 'Controls-Wizard/horizontal';

describe('Controls-Wizard/horizontal:StepBar', () => {
    describe('getStepModifier', () => {
        it('Get active', () => {
            expect('active').toEqual(StepBar.getStepModifier(1, 2, 1));
        });
        it('Get future', () => {
            expect('future').toEqual(StepBar.getStepModifier(3, 2, 1));
        });
        it('Get traversed', () => {
            expect('traversed').toEqual(StepBar.getStepModifier(1, 2, 2));
        });
        it('Get step between current and selected', () => {
            expect('traversed').toEqual(StepBar.getStepModifier(2, 2, 1));
        });
    });
});
