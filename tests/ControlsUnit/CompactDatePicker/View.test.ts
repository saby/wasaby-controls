import View from 'Controls/_compactDatePicker/View';
import { Base as dateUtils } from 'Controls/dateUtils';

describe('Controls/_compactDatePicker/View', () => {
    describe('_beforeMount', () => {
        [
            {
                startValue: new Date(2021, 2, 5),
                position: new Date(2021, 2),
            },
            {
                startValue: new Date(2021, 11, 11),
                position: new Date(2021, 11),
            },
            {
                position: dateUtils.getStartOfMonth(new Date()),
            },
        ].forEach((test, index) => {
            it('should set correct position' + index, () => {
                const component = new View();
                component._beforeMount(test);
                expect(test.position.getFullYear()).toEqual(component._position.getFullYear());
                expect(test.position.getMonth()).toEqual(component._position.getMonth());
            });
        });
    });
});
