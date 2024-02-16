import { SuggestInput } from 'Controls-Name/_input/SuggestInput';
import { Record } from 'Types/entity';
import { TextViewModel } from 'Controls/input';
import { ISuggestInput } from 'Controls-Name/_input/interface/ISuggestInput';

class TestSuggestInput extends SuggestInput {
    // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    proxy(name: string, ...args): any {
        if (typeof args[0] !== 'undefined') {
            return this[name](...args);
        }
        return this[name];
    }

    // eslint-disable-next-line @typescript-eslint/typedef, @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    setState(name: string, value: any): any {
        this[name] = value;
    }
}

describe('Controls-Name/_input/SuggestInput', () => {
    it('_deactivatedHandler', () => {
        const input = new TestSuggestInput({});
        input.setState('_suggestVisible', true);
        input.proxy('_deactivatedHandler', null);
        expect(input.proxy('_suggestVisible')).toEqual(false);
    });

    it('initOptions', () => {
        const input = new TestSuggestInput({});
        const options = {
            firstName: 'Ivan',
            lastName: 'Ivanov',
            middleName: 'Ivanovich',
        };
        input.proxy('_initOptions', options);
        expect(input.proxy('_value')).toEqual({
            firstName: 'Ivan',
            lastName: 'Ivanov',
            middleName: 'Ivanovich',
        });
    });

    describe('choose item in suggest', () => {
        let input;
        beforeEach(() => {
            input = new TestSuggestInput({});
            input._options = {
                displayProperty: 'displayValue',
                firstName: 'Ivan',
                lastName: 'Ivanov',
                middleName: 'Ivanovich',
            };
            input._value = {
                firstName: 'Ivan',
                lastName: 'Ivanov',
                middleName: 'Ivanovich',
            };
        });

        it('prepare string value from record', () => {
            let record;
            let value;

            // emulate choose firstName
            input._lastFinishedInputType = 'firstName';
            record = new Record({
                rawData: {
                    displayValue: 'Aleksey',
                },
            });
            value = input._valueFromRecord(record);
            expect(value).toEqual({
                firstName: 'Aleksey',
                lastName: 'Ivanov',
                middleName: 'Ivanovich',
            });
            // emulate choose lastName
            input._lastFinishedInputType = 'lastName';
            record = new Record({
                rawData: {
                    displayValue: 'Andreev',
                },
            });
            value = input._valueFromRecord(record);
            expect(value).toEqual({
                firstName: 'Ivan',
                lastName: 'Andreev',
                middleName: 'Ivanovich',
            });
            // emulate choose middleName
            input._lastFinishedInputType = 'middleName';
            record = new Record({
                rawData: {
                    displayValue: 'Andreevich',
                },
            });
            value = input._valueFromRecord(record);
            expect(value).toEqual({
                firstName: 'Ivan',
                lastName: 'Ivanov',
                middleName: 'Andreevich',
            });
        });

        it('prepare object value from record', () => {
            // emulate choose firstName
            input._lastFinishedInputType = 'firstName';
            const record = new Record({
                rawData: {
                    displayValue: {
                        firstName: 'Aleksey',
                        lastName: 'Alekseev',
                        middleName: 'Alekseevich',
                    },
                },
            });
            const value = input._valueFromRecord(record);
            expect(value).toEqual({
                firstName: 'Aleksey',
                lastName: 'Alekseev',
                middleName: 'Alekseevich',
            });
        });

        it('prepare value from record while displayProperty not set', () => {
            input._options.displayProperty = null;

            const record = new Record({
                rawData: {
                    displayValue: 'Aleksey',
                },
            });
            // emulate choose firstName
            input._lastFinishedInputType = 'firstName';
            const value = input._valueFromRecord(record);
            expect(value).toEqual(undefined);
        });
    });
    describe('update suggest filter on edit or input focus', () => {
        it('_updateFilter()', () => {
            const input = new TestSuggestInput({});
            input.saveOptions({
                filter: { foo: 'bar', bar: 'baz' },
            } as ISuggestInput);
            const record = new Record({
                rawData: {
                    id: 'lastName',
                    model: new TextViewModel({}, 'Ivanov'),
                },
            });

            const value = {
                lastName: 'Ivanov',
                firstName: 'Ivan',
                middleName: 'Ivanovich',
            };

            input.proxy('_updateFilter', record, input.proxy('_options').filter, value);
            expect(input.proxy('_filter')).toEqual({
                foo: 'bar',
                bar: 'baz',
                hintFieldType: 'lastName',
                hintFieldValue: 'Ivanov',
                value,
            });
        });
    });

    it('_initInputOrder()', () => {
        const input = new TestSuggestInput({});
        input.setState('_value', {
            lastName: 'one',
            firstName: 'two',
            middleName: 'three',
        });
        input.setState('_previonsValueState', {
            lastName: 'Ivanov',
            firstName: 'Ivan',
            middleName: 'Ivanovich',
        });
        input.proxy('_initInputOrder', ['lastName', 'firstName', 'middleName']);
        expect(input.proxy('_showReorderButton')).toBe(false);
        expect(input.proxy('_previousValueState')).toEqual({
            lastName: 'one',
            firstName: 'two',
            middleName: 'three',
        });
        expect(input.proxy('_inputOrder')).toEqual(['lastName', 'firstName', 'middleName']);

        input.setState('_value', {});
        input.setState('_previonsValueState', {
            lastName: 'Ivanov',
            firstName: 'Ivan',
            middleName: 'Ivanovich',
        });
        input.proxy('_initInputOrder', ['firstName', 'lastName', 'middleName']);
        expect(input.proxy('_previousValueState')).toEqual({});
        expect(input.proxy('_inputOrder')).toEqual(['lastName', 'firstName', 'middleName']);

        input.proxy('_initInputOrder', ['firstName', 'lastName']);
        expect(input.proxy('_inputOrder')).toEqual(['lastName', 'firstName']);
    });

    it('_getInputOrder()', () => {
        const input = new TestSuggestInput({});
        let item = new Record({
            rawData: {
                lastName: 'lastName',
                firstName: 'firstName',
                middleName: 'middleName',
                order: ['lastName', 'firstName', 'middleName'],
            },
        });
        let fields = ['lastName', 'firstName', 'middleName'];
        expect(input.proxy('_getInputOrder', item, fields)).toEqual([
            'lastName',
            'firstName',
            'middleName',
        ]);

        fields = ['lastName', 'firstName'];
        expect(input.proxy('_getInputOrder', item, fields)).toEqual(['lastName', 'firstName']);

        fields = ['lastName', 'firstName', 'middleName'];
        item = new Record({
            rawData: {
                lastName: 'lastName',
                firstName: 'firstName',
                middleName: 'middleName',
                order: ['firstName', 'middleName', 'lastName'],
            },
        });
        expect(input.proxy('_getInputOrder', item, fields)).toEqual([
            'firstName',
            'middleName',
            'lastName',
        ]);

        fields = ['lastName', 'firstName', 'middleName'];
        item = new Record({
            rawData: {
                lastName: 'lastName',
                firstName: 'firstName',
                middleName: 'middleName',
            },
        });
        expect(input.proxy('_getInputOrder', item, fields)).toEqual([
            'lastName',
            'firstName',
            'middleName',
        ]);
    });

    it('_isOrderDefault()', () => {
        const input = new TestSuggestInput({});
        let fields = ['lastName', 'firstName', 'middleName'];
        let order = ['lastName', 'firstName', 'middleName'];
        expect(input.proxy('_isOrderDefault', order, fields)).toBe(true);

        fields = ['lastName', 'firstName'];
        order = ['lastName', 'firstName'];
        expect(input.proxy('_isOrderDefault', order, fields)).toBe(true);
        order = ['firstName', 'lastName'];
        expect(input.proxy('_isOrderDefault', order, fields)).toBe(false);

        fields = ['firstName', 'middleName'];
        order = ['firstName', 'middleName'];
        expect(input.proxy('_isOrderDefault', order, fields)).toBe(true);
        order = ['middleName', 'firstName'];
        expect(input.proxy('_isOrderDefault', order, fields)).toBe(false);

        fields = ['firstName'];
        order = ['firstName'];
        expect(input.proxy('_isOrderDefault', order, fields)).toBe(true);
    });

    it('_searchEnd', () => {
        const input = new TestSuggestInput({});
        const newSearchState = ['lastName', 'firstName', 'middleName'];
        input.setState('_searchState', newSearchState.slice());
        input.proxy('_searchEnd', null);
        expect(input.proxy('_lastFinishedInputType')).toEqual(newSearchState.pop());
    });
});
