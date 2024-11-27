import { Switch } from 'Controls/toggle';

let SW;
let changeValue;
describe('Controls/_toggle/Switch', () => {
    beforeEach(() => {
        SW = new Switch({
            caption: 'capt1',
        });
        // subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
        // (дефолтный метод для vdom компонент который стреляет событием).
        // он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
        // событие и оно полетит с корректными параметрами.
        SW._notify = (event, eventChangeValue) => {
            if (event === 'valueChanged') {
                changeValue = eventChangeValue[0];
            }
        };
    });

    it('click to ON state', () => {
        const opt = {
            value: false,
        };
        SW.saveOptions(opt);
        SW._clickHandler();
        expect(changeValue).toBe(true);
    });

    it('click to OFF state', () => {
        const opt = {
            value: true,
        };
        SW.saveOptions(opt);
        SW._clickHandler();
        expect(!changeValue).toBe(false);
    });

    it('value is empty', () => {
        SW.saveOptions({});
        SW._beforeMount({}, {});
        SW._clickHandler();
        expect(changeValue).toBe(true);
        SW._clickHandler();
        expect(changeValue).toBe(false);
    });
});
