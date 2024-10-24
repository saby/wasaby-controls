/**
 * Created by am.gerasimov on 31.05.2018.
 */

import { default as Lookup } from 'Controls/_lookup/Lookup';
import { Model } from 'Types/entity';
import { List } from 'Types/collection';
import { Memory } from 'Types/source';

function getMemoryWithFilter(): Memory {
    return new Memory({
        data: [
            {
                id: 0,
                name: 'Sasha',
            },
            {
                id: 1,
                name: 'Sergey',
            },
            {
                id: 2,
                name: 'Aleksey',
            },
        ],
        filter: (item, query) => {
            return query?.id.includes(item.get('id'));
        },
        keyProperty: 'id',
    });
}

function getItems(countItems: number): List<Model> {
    const items = [];
    for (; countItems; countItems--) {
        items.push(
            new Model({
                rawData: { id: countItems },
                keyProperty: 'id',
            })
        );
    }

    return new List({
        items,
    });
}

describe('Controls/_lookup/Lookup/LookupView', () => {
    describe('_beforeUpdate', () => {
        it('items are loaded and sizes calculated after selectedKeys changed', async () => {
            const lookup = new Lookup();
            // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
            jest.spyOn(lookup, '_forceUpdate').mockImplementation();
            let options = {
                source: getMemoryWithFilter(),
                keyProperty: 'id',
                selectedKeys: [],
                multiSelect: true,
            };
            let itemsChanged = false;

            await lookup._beforeMount(options);

            options = { ...options };
            options.selectedKeys = [0, 1];
            lookup._itemsChanged = () => {
                itemsChanged = true;
            };

            await lookup._beforeUpdate(options);

            expect(lookup._items.getCount()).toBeGreaterThan(0);
            expect(itemsChanged).toBe(true);
        });
    });

    it('getAvailableCollectionWidth', () => {
        const afterFieldWrapperWidth = 20;
        const lookup = new Lookup();

        jest.spyOn(lookup, '_getFieldWrapperComputedStyle')
            .mockClear()
            .mockImplementation(() => {
                return {
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    borderLeftWidth: '1px',
                    borderRightWidth: '1px',
                };
            });

        lookup._fieldWrapperWidth = 100;
        lookup._fieldWrapperMinHeight = 24;
        lookup._fieldWrapper = {
            offsetWidth: 110,
        };

        expect(lookup._getAvailableCollectionWidth(afterFieldWrapperWidth, false, false)).toBe(80);
        expect(lookup._getAvailableCollectionWidth(afterFieldWrapperWidth, false, true)).toBe(50);
        expect(
            lookup._getAvailableCollectionWidth(afterFieldWrapperWidth, false, false, true)
        ).toBe(50);

        lookup._fieldWrapperMinHeight = 5;
        expect(lookup._getAvailableCollectionWidth(afterFieldWrapperWidth, false, true)).toBe(60);
        jest.restoreAllMocks();
    });

    it('getInputMinWidth', () => {
        const lookup = new Lookup();
        expect(lookup._getInputMinWidth(330, 30, 24)).toBe(96);
        expect(lookup._getInputMinWidth(330, 30, 30)).toBe(100);
        expect(lookup._getInputMinWidth(150, 30, 24)).toBe(40);
    });

    it('getLastSelectedItems', () => {
        const item = new Model({
            rawData: { id: 1 },
            keyProperty: 'id',
        });
        const item2 = new Model({
            rawData: { id: 2 },
            keyProperty: 'id',
        });
        const items = new List({
            items: [item, item2],
        });
        const lookup = new Lookup();

        expect(lookup._getLastSelectedItems(items, 1)).toEqual([item2]);
        expect(lookup._getLastSelectedItems(items, 10)).toEqual([item, item2]);
    });

    it('isShowCounter', () => {
        const lookup = new Lookup();
        expect(lookup._isShowCounter(true, 10, 5)).toBe(true);
        expect(lookup._isShowCounter(true, 10, 20)).toBe(false);
        expect(lookup._isShowCounter(false, 2)).toBe(true);
        expect(lookup._isShowCounter(false, 1)).toBe(false);
    });

    it('getInputWidth', () => {
        const lookup = new Lookup();
        expect(lookup._getInputWidth(400, 200, 100, 48, true, 0, true)).toBeUndefined();
        expect(lookup._getInputWidth(400, 200, 300, 48, true, 0, true)).toBe(152);
    });

    it('getMultiLineState', () => {
        const lookup = new Lookup();
        expect(lookup._getMultiLineState(200, 100, true)).toBe(true);
        expect(lookup._getMultiLineState(200, 300, true)).toBe(false);
        expect(lookup._getMultiLineState(200, 300, false)).toBe(true);
    });

    it('_isNeedCalculatingSizes', () => {
        const lookup = new Lookup();

        lookup._items = getItems(0);
        expect(
            lookup._isNeedCalculatingSizes({
                multiSelect: true,
                readOnly: false,
            })
        ).toBe(false);

        lookup._items = getItems(1);
        expect(
            lookup._isNeedCalculatingSizes({
                multiSelect: false,
                readOnly: false,
            })
        ).toBeUndefined();

        lookup._items = getItems(1);
        expect(
            lookup._isNeedCalculatingSizes({
                multiSelect: false,
                readOnly: false,
                comment: 'notEmpty',
            })
        ).toBe(true);

        lookup._items = getItems(1);
        expect(
            lookup._isNeedCalculatingSizes({
                multiSelect: true,
                readOnly: true,
            })
        ).toBeUndefined();

        lookup._items = getItems(1);
        expect(
            lookup._isNeedCalculatingSizes({
                multiSelect: true,
                multiLine: true,
                readOnly: false,
            })
        ).toBe(true);

        lookup._items = getItems(2);
        expect(
            lookup._isNeedCalculatingSizes({
                multiSelect: true,
                multiLine: true,
                readOnly: true,
            })
        ).toBe(true);
    });

    it('_isInputVisible', () => {
        const lookup = new Lookup();

        lookup._items = getItems(0);
        expect(
            lookup._isInputVisible({
                multiSelect: false,
                readOnly: false,
            })
        ).toBe(true);

        lookup._items = getItems(1);
        expect(
            lookup._isInputVisible({
                multiSelect: false,
                readOnly: false,
            })
        ).toBe(false);

        lookup._items = getItems(1);
        expect(
            lookup._isInputVisible({
                multiSelect: false,
                comment: 'notEmpty',
                readOnly: false,
            })
        ).toBe(true);

        lookup._items = getItems(1);
        expect(
            lookup._isInputVisible({
                multiSelect: true,
                readOnly: false,
            })
        ).toBe(true);

        lookup._items = getItems(1);
        expect(
            lookup._isInputVisible({
                multiSelect: true,
                readOnly: true,
            })
        ).toBe(false);

        lookup._inputValue = 'notEmpty';
        lookup._items = getItems(0);
        expect(
            lookup._isInputVisible({
                multiSelect: true,
                readOnly: true,
            })
        ).toBe(false);

        lookup._items = getItems(0);
        expect(
            lookup._isInputVisible({
                multiSelect: false,
                readOnly: true,
            })
        ).toBe(true);

        lookup._items = getItems(1);
        expect(
            lookup._isInputVisible({
                placeholder: 'test',
                placeholderVisibility: 'empty',
                readOnly: true,
            })
        ).toBe(false);

        lookup._items = getItems(0);
        expect(
            lookup._isInputVisible({
                placeholder: 'test',
                placeholderVisibility: 'empty',
                readOnly: true,
            })
        ).toBe(true);
    });

    it('_isInputActive', () => {
        const lookup = new Lookup();

        lookup._items = getItems(0);
        expect(
            lookup._isInputActive({
                multiSelect: false,
                readOnly: false,
            })
        ).toBe(true);

        lookup._items = getItems(1);
        expect(
            lookup._isInputActive({
                multiSelect: false,
                readOnly: false,
            })
        ).toBe(false);

        lookup._items = getItems(1);
        expect(
            lookup._isInputActive({
                multiSelect: true,
                readOnly: false,
            })
        ).toBe(true);

        lookup._items = getItems(1);
        expect(
            lookup._isInputActive({
                multiSelect: true,
                readOnly: true,
            })
        ).toBe(false);
    });

    it('_calculatingSizes', () => {
        // min width const 4 * FIELD_WRAPPER_MIN_HEIGHT = 100;
        const FIELD_WRAPPER_MIN_HEIGHT = 25;
        const FIELD_WRAPPER_WIDTH = 300;
        const ITEM_WIDTH = 50;
        const COUNTER_WIDTH = 20;
        const MAX_ITEMS_IN_ONE_ROW = FIELD_WRAPPER_WIDTH / ITEM_WIDTH;

        const lookup = new Lookup();
        const getItemsSizesLastRow = lookup._getItemsSizesLastRow;
        const getCounterWidth = lookup._getCounterWidth;
        const initializeConstants = lookup._initializeConstants;
        const newOptions = {
            maxVisibleItems: 7,
            multiSelect: true,
            multiLine: false,
            readOnly: false,
            fontSize: 's',
            theme: 'testTheme',
            needCalculateMultiLine: true,
        };

        jest.spyOn(lookup, '_getFieldWrapperComputedStyle')
            .mockClear()
            .mockImplementation(() => {
                return {
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    borderLeftWidth: '1px',
                    borderRightWidth: '1px',
                };
            });

        lookup._fieldWrapper = {
            offsetWidth: FIELD_WRAPPER_WIDTH,
        };
        lookup._items = getItems(6);
        lookup._fieldWrapperWidth = FIELD_WRAPPER_WIDTH;
        lookup._fieldWrapperMinHeight = FIELD_WRAPPER_MIN_HEIGHT;

        lookup._getItemsSizesLastRow = (
            fieldWrapperWidth,
            items,
            newOptions,
            counterWidth,
            callback
        ) => {
            let numberItems = lookup._items.getCount();

            if (newOptions.multiLine) {
                // Счетчик сместит запись
                if (lookup._items.getCount() > newOptions.maxVisibleItems) {
                    numberItems++;
                }

                numberItems = numberItems % MAX_ITEMS_IN_ONE_ROW || MAX_ITEMS_IN_ONE_ROW;
            }

            callback(new Array(numberItems).fill(ITEM_WIDTH));
        };

        lookup._getCounterWidth = () => {
            return COUNTER_WIDTH;
        };
        lookup._initializeConstants = jest.fn();

        newOptions.multiSelect = true;
        lookup._calculateSizes(newOptions);
        expect(lookup._multiLineState).toBe(false);

        // Если айтема 4, то влезут все, т.к не нужно показывать счетчик
        lookup._items = getItems(4);
        lookup._calculateSizes(newOptions);
        expect(lookup._maxVisibleItems).toBe(4);

        newOptions.multiLine = true;
        lookup._calculateSizes(newOptions);
        expect(lookup._multiLineState).toBe(false);
        expect(lookup._inputWidth).toBe(100);
        expect(lookup._maxVisibleItems).toBe(7);
        expect(lookup._counterWidth).toBeUndefined();

        // Инпут на уровне с последними элементами коллекции(расположение по строкам 3-4-4-1 и input)
        lookup._items = getItems(12);
        lookup._calculateSizes(newOptions);
        expect(lookup._multiLineState).toBeTruthy();
        expect(lookup._inputWidth).toBe(250);

        // Инпут с новой строки(расположение 3-4-4-input)
        lookup._items = getItems(11);
        lookup._calculateSizes(newOptions);
        expect(lookup._inputWidth).toBeUndefined();

        // Режим readOnly
        newOptions.readOnly = true;
        newOptions.multiSelect = false;
        lookup._calculateSizes(newOptions);
        expect(lookup._inputWidth).toBeUndefined();
        expect(lookup._maxVisibleItems).toBe(lookup._items.getCount());

        lookup._getItemsSizesLastRow = getItemsSizesLastRow;
        lookup._getCounterWidth = getCounterWidth;
        lookup._initializeConstants = initializeConstants;
    });

    it('getCollectionOptions', () => {
        const standardOptions = {
            itemTemplate: 'testItemTemplate',
            readOnly: 'testReadOnly',
            displayProperty: 'testReadOnly',
            itemsLayout: 'oneRow',
            maxVisibleItems: 10,
            _counterWidth: '10px',
            theme: 'default',
            items: undefined,
        };

        const controlOptions = {
            itemTemplate: 'testItemTemplate',
            readOnly: 'testReadOnly',
            displayProperty: 'testReadOnly',
            multiLine: false,
            theme: 'default',
        };

        const lookup = new Lookup({});

        expect(lookup._getCollectionOptions(controlOptions, 10, '10px')).toEqual(standardOptions);

        delete controlOptions.itemTemplate;
        expect(lookup._getCollectionOptions(controlOptions, 10, '10px')).not.toHaveProperty(
            'itemTemplate'
        );
    });
});
