import { DropdownEditor } from 'Controls/filterPanel';
import { RecordSet } from 'Types/collection';

describe('Controls/filterPanel:DropdownEditor', () => {
    describe('_applySelectedItems', () => {
        const dropdownOptions = {
            keyProperty: 'id',
            displayProperty: 'title',
        };
        const dropdownEditor = new DropdownEditor(dropdownOptions);
        let selectedKeys;

        dropdownEditor._notify = (eventName, extendedValue) => {
            selectedKeys = extendedValue[0].value;
        };

        it('if multiSelect true the function return an array', () => {
            dropdownEditor.saveOptions({
                ...dropdownOptions,
                ...{
                    multiSelect: true,
                },
            });
            const data = new RecordSet({
                rawData: [{ id: 1, title: 'TestTitle' }],
                keyProperty: 'id',
            });
            dropdownEditor._applySelectedItems(data);
            expect(selectedKeys).toEqual([1]);
        });

        it('if multiSelect false the function return an object', () => {
            dropdownEditor.saveOptions({
                ...dropdownOptions,
                ...{
                    multiSelect: false,
                },
            });
            const data = new RecordSet({
                rawData: [{ id: 1, title: 'TestTitle' }],
                keyProperty: 'id',
            });
            dropdownEditor._applySelectedItems(data);
            expect(selectedKeys).toEqual(1);
        });
    });
});
