import { Checkbox } from 'Controls/checkbox';

let CB;
let changeValue;
let eventValue;
describe('Controls/_checkbox/Checkbox', () => {
    describe('click to checkbox', () => {
        beforeEach(() => {
            const props = {
                value: false,
            };
            CB = new Checkbox(props);
            CB._beforeMount(props, {});
            // subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
            // (дефолтный метод для vdom компонент который стреляет событием).
            // он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
            // событие и оно полетит с корректными параметрами.
            CB._notify = (e, value) => {
                eventValue = value[0];
                changeValue = e === 'valueChanged';
            };
        });

        afterEach(() => {
            CB = undefined;
            changeValue = undefined;
            eventValue = undefined;
        });

        it('checkbox no select => select, tristate false', () => {
            const opt = {
                value: false,
                triState: false,
            };
            CB.saveOptions(opt);
            CB._clickHandler();
            expect(changeValue && eventValue === true).toBeTruthy();
        });

        it('checkbox select => not select, tristate false', () => {
            const opt = {
                value: true,
                triState: false,
            };
            CB.saveOptions(opt);
            CB._value = true;
            CB._clickHandler();
            expect(changeValue && eventValue === false).toBeTruthy();
        });

        it('checkbox not select => select, tristate true', () => {
            const opt = {
                value: false,
                triState: true,
            };
            CB.saveOptions(opt);
            CB._clickHandler();
            expect(changeValue && eventValue === true).toBeTruthy();
        });

        it('checkbox select => triState, tristate true', () => {
            const opt = {
                value: true,
                triState: true,
            };
            CB.saveOptions(opt);
            CB._value = true;
            CB._clickHandler();
            expect(changeValue && eventValue === null).toBeTruthy();
        });

        it('checkbox in triState => not select, tristate true', () => {
            const opt = {
                value: null,
                triState: true,
            };
            CB.saveOptions(opt);
            CB._value = null;
            CB._clickHandler();
            expect(changeValue && eventValue === false).toBeTruthy();
        });
    });
});
