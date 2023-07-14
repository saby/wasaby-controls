import { Input } from 'Controls/lookup';
import { RecordSet } from 'Types/collection';
import { Stack } from 'Controls/popup';
import { Memory } from 'Types/source';

function getData(): object[] {
    return [
        {
            id: 0,
            title: 'Sasha',
        },
        {
            id: 1,
            title: 'Aleksey',
        },
        {
            id: 2,
            title: 'Dmitry',
        },
    ];
}

function getSource(): Memory {
    return new Memory({
        keyProperty: 'id',
        data: getData(),
        filter: (item, where) => {
            return where.id && where.id.indexOf(item.get('id')) !== -1;
        },
    });
}

function getLookupOptions(): object {
    return {
        source: getSource(),
        keyProperty: 'id',
        selectedKeys: [],
    };
}

function getLookup({ closeSuggestCallback }) {
    const lookupControl = new Input();
    lookupControl._lookupController = {
        getItems: () => {
            return new RecordSet();
        },
        getSelectedKeys: () => {
            return [];
        },
    };
    lookupControl.closeSuggest = () => {
        closeSuggestCallback();
    };
    return lookupControl;
}

describe('lookup', () => {
    it('showSelector', () => {
        let isSuggestClosed = false;
        let isSelectorOpened = false;
        jest.spyOn(Stack, '_openPopup')
            .mockClear()
            .mockImplementation(() => {
                isSelectorOpened = true;
                return Promise.resolve('123');
            });

        const lookup = getLookup({
            closeSuggestCallback: () => {
                isSuggestClosed = true;
            },
        });
        lookup.showSelector({
            template: 'testTemplate',
        });
        expect(isSelectorOpened).toBeTruthy();
        expect(isSuggestClosed).toBeTruthy();
        jest.restoreAllMocks();
    });

    describe('_beforeMount', () => {
        it('selectedKeys is empty (selectedKeys: [])', () => {
            const options = getLookupOptions();
            const lookup = new Input(options);

            expect(lookup._beforeMount(options)).toBeUndefined();
        });

        it('selectedKeys is not empty (selectedKeys: [0, 1])', async () => {
            const options = getLookupOptions();
            options.selectedKeys = [0, 1];
            options.multiSelect = true;
            const lookup = new Input(options);
            await lookup._beforeMount(options);

            expect(lookup._lookupController.getItems().getCount()).toBe(2);
        });
    });

    describe('_isInputVisible', () => {
        it('selectedKeys is empty (selectedKeys: []), readOnly: true, placeholderVisbility: "empty", input should be visible', async () => {
            const options = getLookupOptions();
            options.placeholderVisibility = 'empty';
            options.readOnly = true;
            options.placeholder = {};
            const lookup = new Input(options);
            await lookup._beforeMount(options);
            lookup.saveOptions(options);

            expect(lookup._isInputVisible(options)).toBeTruthy();
        });

        it('readOnly: false, placeholderVisbility: "empty", input should be hidden', async () => {
            const options = getLookupOptions();
            options.placeholderVisibility = 'empty';
            options.readOnly = false;
            options.placeholder = {};
            options.selectedKeys = [1];
            const lookup = new Input(options);
            await lookup._beforeMount(options);
            lookup.saveOptions(options);

            expect(!lookup._isInputVisible(options)).toBeTruthy();
        });
    });
});
