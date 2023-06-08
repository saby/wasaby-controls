import { NumberRangeEditor } from 'Controls/filterPanelExtEditors';
import { StickyOpener } from 'Controls/popup';

describe('Controls/filterPanelExtEditors:NumberRangeEditor', () => {
    describe('_handleInputCompleted', () => {
        const numberRangeEditor = new NumberRangeEditor({});
        let changesNotified = false;
        let textValue = null;
        const event = {
            target: {
                closest: jest.fn(),
            },
        };
        numberRangeEditor._notify = (eventName, extendedValue) => {
            textValue = extendedValue[0].textValue;
            changesNotified = true;
        };

        numberRangeEditor._applyButtonSticky = new StickyOpener();

        it('minValue is null', () => {
            numberRangeEditor._maxValue = 5;
            numberRangeEditor._handleInputCompleted(event, 1);
            expect(textValue).toEqual('до 5');
            expect(changesNotified).toBe(true);
        });

        it('minValue is 0', () => {
            numberRangeEditor._minValue = 0;
            numberRangeEditor._handleInputCompleted(event, 0);
            expect(textValue).toEqual('от 0 до 5');
            expect(changesNotified).toBe(true);
        });

        it('maxValue is less than minValue', () => {
            numberRangeEditor._minValue = 10;
            numberRangeEditor._maxValue = 1;
            numberRangeEditor._handleInputCompleted(event, 1);
            expect(numberRangeEditor._minValue).toEqual(1);
            expect(numberRangeEditor._maxValue).toEqual(10);
        });
    });

    describe('_handleMinValueChanged', () => {
        const numberRangeEditor = new NumberRangeEditor({});
        const event = {
            target: {
                closest: jest.fn(),
            },
        };
        numberRangeEditor._applyButtonSticky = new StickyOpener();

        it('minValue is less than maxValue', () => {
            numberRangeEditor._maxValue = 5;
            numberRangeEditor._handleMinValueChanged(event, 1);
            expect(numberRangeEditor._minValue).toEqual(1);
        });

        it('minValue is equal to maxValue', () => {
            numberRangeEditor._maxValue = 5;
            numberRangeEditor._handleMinValueChanged(event, 5);
            expect(numberRangeEditor._minValue).toEqual(5);
        });

        it('minValue is bigger than maxValue', () => {
            numberRangeEditor._handleInputCompleted(event, 16);
            expect(numberRangeEditor._minValue).toEqual(5);
        });
    });

    describe('_processPropertyValueChanged', () => {
        const numberRangeEditor = new NumberRangeEditor({});
        let changesNotified = false;
        const event = {
            target: {
                closest: jest.fn(),
            },
        };
        numberRangeEditor._notify = (actionName: string) => {
            if (actionName === 'propertyValueChanged') {
                changesNotified = true;
            }
        };
        it('minValue is bigger than maxValue', () => {
            numberRangeEditor._processPropertyValueChanged(event, [4, 3]);
            expect(changesNotified).toBe(false);
        });

        it('minValue is less than maxValue', () => {
            numberRangeEditor._processPropertyValueChanged(event, [3, 4]);
            expect(changesNotified).toBe(true);
        });
    });

    describe('_needNotifyChanges', () => {
        const numberRangeEditor = new NumberRangeEditor({});
        it('minValue is equal to maxValue', () => {
            const value = [1, 1];
            expect(numberRangeEditor._needNotifyChanges(value)).toBe(true);
        });
    });

    describe('_notifyPropertyValueChanged', () => {
        const numberRangeEditor = new NumberRangeEditor({});
        let value;
        numberRangeEditor._notify = (eventName, extendedValue) => {
            value = extendedValue[0].value;
        };

        it('extended value updated after input value changed', () => {
            const minValue = 1;
            const maxValue = 4;
            numberRangeEditor._handleMinValueChanged(null, minValue);
            numberRangeEditor._handleMaxValueChanged(null, maxValue);
            numberRangeEditor._processPropertyValueChanged(null, []);
            expect(value).toEqual([1, 4]);
        });
    });
});
