import { Field, TextViewModel } from 'Controls/input';
import WorkWithSelection from 'Controls/_input/resources/Field/WorkWithSelection';

describe('Controls/input:Field', () => {
    let ctrl: Field<any, any>;
    const model = new TextViewModel({}, '');
    beforeEach(() => {
        ctrl = new Field({ name: 'field', model });
        ctrl._fieldRef = {
            current: {
                setSelectionRange(start: number, end: number): void {
                    this.selectionStart = start;
                    this.selectionEnd = end;
                },
            },
        };
    });
    it('Public method paste.', () => {
        let actual;
        ctrl._handleInput = (...args) => {
            actual = args;
        };
        model.value = '';
        ctrl.paste('test paste');

        expect(actual).toEqual([
            {
                before: '',
                insert: 'test paste',
                delete: '',
                after: '',
            },
            'insert',
        ]);
    });
    describe('hasAutoFill', () => {
        let eventName;
        beforeEach(() => {
            eventName = null;
            ctrl._notifyEvent = (optName) => {
                eventName = optName;
            };
        });
        it('Yes', () => {
            model.value = '';

            ctrl._getField().value = 'fill';
            ctrl.componentDidMount();
            expect(eventName).toEqual('valueChanged');
        });
        it('No', () => {
            model.value = 'fill';
            ctrl._getField().value = 'fill';
            ctrl.componentDidMount();
            expect(eventName).toEqual(null);
        });
    });
    describe('Click event', () => {
        it('The selection is saved to the model.', (done) => {
            model.value = '1234567890';
            ctrl._getField().selectionStart = 10;
            ctrl._getField().selectionEnd = 10;
            ctrl._clickHandler();

            setTimeout(() => {
                expect(ctrl._model.selection).toEqual({
                    start: 10,
                    end: 10,
                });
                done();
            }, 100);
        });
        it('The selection is not saved to the model because control is destroyed.', (done) => {
            model.value = '1234567890';

            ctrl._getField().selectionStart = 5;
            ctrl._getField().selectionEnd = 5;
            ctrl._destroyed = true;
            ctrl._clickHandler();

            setTimeout(() => {
                expect(ctrl._model.selection).toEqual({
                    start: 10,
                    end: 10,
                });
                done();
            }, 100);
        });
        it('Select event raised before synchronize new selection value from model.', () => {
            model.value = '1234567890';

            const field = ctrl._getField();
            const target = {
                selectionStart: model.value.length,
                selectionEnd: model.value.length,
            };
            const isFieldFocusedOriginal = WorkWithSelection.isFieldFocused;
            WorkWithSelection.isFieldFocused = () => {
                return true;
            };
            ctrl._focusHandler({
                target,
                nativeEvent: {
                    target,
                },
            });
            ctrl.setSelectionRange(0, 7);
            // Отстрельнуло после фокуса
            ctrl._selectHandler();
            // После установки селекшена
            ctrl._selectHandler();
            // Это баг, из-за которого стреляет лишний раз, см FixBugs
            ctrl._selectHandler();

            expect(model.selection).toEqual({
                start: 0,
                end: 7,
            });

            expect(field.selectionStart).toEqual(0);
            expect(field.selectionEnd).toEqual(7);
            WorkWithSelection.isFieldFocused = isFieldFocusedOriginal;
        });
    });
});
