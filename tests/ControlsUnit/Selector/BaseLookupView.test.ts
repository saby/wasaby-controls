/**
 * Created by am.gerasimov on 31.05.2018.
 */

import { default as Lookup } from 'Controls/_lookup/Lookup';
import { Model } from 'Types/entity';
import { List } from 'Types/collection';
import { DOMUtil } from 'Controls/sizeUtils';
import { constants } from 'Env/Env';

function getItems(countItems: number): List<unknown> {
    const items = [];
    for (items; countItems; countItems--) {
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

function getLookup(): Lookup {
    const lookup = new Lookup();
    lookup._children = {
        layout: {
            closeSuggest: jest.fn(),
        },
    };
    return lookup;
}

describe('Controls/_lookup/BaseLookupView', () => {
    let lookup;
    beforeEach(() => {
        lookup = getLookup();
        // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
        jest.spyOn(lookup, '_forceUpdate').mockImplementation();
    });
    it('_beforeMount', () => {
        let options;

        options = {
            selectedKeys: [],
            multiLine: true,
            maxVisibleItems: 10,
            readOnly: true,
            multiSelect: true,
        };
        lookup._items = getItems(5);
        lookup._inheritorBeforeMount(options);
        expect(lookup._maxVisibleItems).toBe(10);

        options = { selectedKeys: [], readOnly: true, multiSelect: true };
        lookup._inheritorBeforeMount(options);
        expect(lookup._maxVisibleItems).toBe(5);

        options = { selectedKeys: [], readOnly: false, multiSelect: true };
        lookup._inheritorBeforeMount(options);
        expect(lookup._maxVisibleItems).toBe(5);

        options = { selectedKeys: [], readOnly: true };
        lookup._inheritorBeforeMount(options);
        expect(lookup._maxVisibleItems).toBe(1);

        options = { selectedKeys: [], value: 'test' };
        lookup._inheritorBeforeMount(options);
        lookup.saveOptions(options);
        expect(lookup._maxVisibleItems).toBe(1);
        expect(lookup._getInputValue(options)).toBe('test');
    });

    it('_afterUpdate', () => {
        let configActivate;
        let activated = false;

        lookup._suggestState = false;
        lookup._needSetFocusInInput = true;
        lookup._options.items = getItems(0);
        lookup.activate = (config) => {
            configActivate = config;
            activated = true;
        };

        lookup._afterUpdate();
        expect(!activated).toBeTruthy();
        expect(!lookup._needSetFocusInInput).toBeTruthy();

        lookup._needSetFocusInInput = true;
        lookup._active = true;
        lookup._afterUpdate();
        expect(activated).toBeTruthy();
        expect(!lookup._needSetFocusInInput).toBeTruthy();
        expect(configActivate).toBe(undefined);
        expect(!lookup._suggestState).toBeTruthy();

        lookup._needSetFocusInInput = true;
        lookup._determineAutoDropDown = () => {
            return true;
        };
        lookup._afterUpdate();
        expect(lookup._suggestState).toBeTruthy();
    });

    it('_changeValueHandler', () => {
        let newValue = [];

        lookup.saveOptions(Lookup.getDefaultOptions());

        lookup._notify = (event, value) => {
            if (event === 'valueChanged') {
                newValue = value;
            }
        };
        lookup._changeValueHandler(null, 1);
        expect(newValue).toEqual([1]);
        expect(lookup._inputValue).toBe(1);
    });

    it('_choose', () => {
        let itemAdded = false;
        let isActivated = false;
        let lastValueAtNotify;
        const selectedItem = { id: 1 };

        lookup.saveOptions({});
        lookup._isInputVisible = false;
        lookup._addItem = (value) => {
            lastValueAtNotify = value;
            itemAdded = true;
        };
        lookup.activate = () => {
            isActivated = true;

            // activate input before add.
            expect(!itemAdded).toBeTruthy();
        };

        lookup._beforeMount({
            selectedKeys: [],
            multiLine: true,
            items: getItems(1),
        });

        lookup._options.multiSelect = false;
        lookup._choose();
        expect(itemAdded).toBeTruthy();
        expect(lookup._needSetFocusInInput).toBeTruthy();
        expect(isActivated).toBeTruthy();

        itemAdded = false;
        isActivated = false;
        lookup._needSetFocusInInput = false;
        lookup._options.multiSelect = true;
        lookup._choose();
        expect(!lookup._needSetFocusInInput).toBeTruthy();
        expect(isActivated).toBeTruthy();

        itemAdded = false;
        lookup._inputValue = 'not empty';
        lookup._choose(null, selectedItem);
        expect(lookup._inputValue).toBe('');
        expect(lastValueAtNotify).toBe(selectedItem);
    });

    it('_deactivated', () => {
        lookup._suggestState = true;
        lookup._deactivated();
        expect(!lookup._suggestState).toBeTruthy();
    });

    it('_suggestStateChanged', () => {
        lookup._beforeMount({ selectedKeys: [] });
        lookup._suggestState = true;
        lookup._suggestStateChanged({}, false);
        expect(!lookup._suggestState).toBeTruthy();

        lookup._suggestState = true;
        lookup._isInputVisible = () => {
            return true;
        };
        lookup._suggestStateChanged({}, true);
        expect(lookup._suggestState).toBeTruthy();

        lookup._infoboxOpened = true;
        lookup._suggestStateChanged({}, true);
        expect(!lookup._suggestState).toBeTruthy();
    });

    it('_determineAutoDropDown', () => {
        lookup._items = getItems(1);
        lookup._isInputVisible = () => {
            return false;
        };
        lookup._options.autoDropDown = true;
        expect(!lookup._determineAutoDropDown()).toBeTruthy();
        lookup._items.clear();
        lookup._isInputVisible = () => {
            return true;
        };
        expect(lookup._determineAutoDropDown()).toBeTruthy();

        lookup._options.autoDropDown = false;
        expect(!lookup._determineAutoDropDown()).toBeTruthy();
    });

    it('_onMouseDownShowSelector', () => {
        lookup._getFieldWrapperWidth = jest.fn();
        lookup._suggestState = true;
        lookup._onMouseDownShowSelector();

        expect(!lookup._suggestState).toBeTruthy();
    });

    it('_onClickClearRecords', () => {
        let configActivate;
        let activated = false;

        lookup._beforeMount({ selectedKeys: [] });
        lookup.activate = (config) => {
            configActivate = config;
            activated = true;
        };

        lookup._options.selectedKeys = [];
        lookup._onClickClearRecords();
        expect(activated).toBeTruthy();
        expect(configActivate).toBe(undefined);
    });

    it('_keyDown', async () => {
        let isNotifyShowSelector = false;
        let isNotifyRemoveItems = false;
        const eventBackspace = {
            nativeEvent: {
                keyCode: constants.key.backspace,
            },
        };
        const eventNotBackspace = {
            nativeEvent: {},
        };
        const eventF2 = {
            nativeEvent: {
                keyCode: 113,
            },
        };

        lookup._removeItem = (item) => {
            isNotifyRemoveItems = true;
            expect(lookup._items.at(lookup._items.getCount() - 1)).toBe(item);
        };

        lookup.showSelector = () => {
            isNotifyShowSelector = true;
        };

        lookup._beforeMount({
            value: '',
            items: getItems(0),
            selectedKeys: [],
        });
        lookup._items = getItems(0);
        lookup._keyDown(eventBackspace);
        expect(!isNotifyRemoveItems).toBeTruthy();

        lookup._items = getItems(5);
        lookup._keyDown(eventNotBackspace);
        expect(!isNotifyRemoveItems).toBeTruthy();

        lookup._keyDown(eventBackspace);
        expect(isNotifyRemoveItems).toBeTruthy();
        isNotifyRemoveItems = false;

        lookup._beforeMount({
            value: 'not empty valeue',
            items: getItems(1),
            selectedKeys: [],
        });
        lookup._options.value = 'not empty valeue';
        lookup._keyDown(eventBackspace);
        expect(!isNotifyRemoveItems).toBeTruthy();
        expect(!isNotifyShowSelector).toBeTruthy();

        await lookup._keyDown(eventF2);
        expect(isNotifyShowSelector).toBeTruthy();
    });

    it('_openInfoBox', async () => {
        let isNotifyOpenPopup = false;

        lookup._suggestState = true;
        lookup._notify = (eventName) => {
            if (eventName === 'openInfoBox') {
                isNotifyOpenPopup = true;
            }
        };

        await lookup._openInfoBox();
        expect(!lookup._suggestState).toBeTruthy();
        expect(lookup._infoboxOpened).toBeTruthy();
        expect(isNotifyOpenPopup).toBeTruthy();
    });

    it('_closeInfoBox', () => {
        let isNotifyClosePopup = false;

        lookup._infoboxOpened = true;
        lookup._notify = (eventName) => {
            if (eventName === 'closeInfoBox') {
                isNotifyClosePopup = true;
            }
        };

        lookup._closeInfoBox();
        expect(!lookup._infoboxOpened).toBeTruthy();
        expect(isNotifyClosePopup).toBeTruthy();
    });

    it('resetInputValue', () => {
        const stub = jest.spyOn(lookup, '_notify').mockImplementation();
        lookup.saveOptions({
            value: '',
        });

        lookup._resetInputValue();
        expect(stub).not.toHaveBeenCalled();

        lookup.saveOptions({
            value: 'notEmpty',
        });
        lookup._resetInputValue();
        expect(stub).toHaveBeenCalledWith('valueChanged', ['']);

        lookup.saveOptions({});
        lookup._inputValue = 'notEmpty';
        lookup._resetInputValue();
        expect(lookup._inputValue).toBe('');
    });

    it('setInputValue', () => {
        let forceUpdateCalled = false;

        lookup._forceUpdate = () => {
            forceUpdateCalled = true;
        };

        lookup._setInputValue({}, 'test');
        expect(lookup._inputValue === 'test').toBeTruthy();
        expect(forceUpdateCalled).toBeTruthy();
    });

    it('activate', () => {
        let isActivate = false;

        lookup._needSetFocusInInput = false;
        lookup.saveOptions({ multiSelect: false });
        lookup.activate = (cfg) => {
            expect(cfg).toEqual({ enableScreenKeyboard: true });
            isActivate = true;
        };

        lookup._activateLookup();
        expect(isActivate).toBeTruthy();
        expect(lookup._needSetFocusInInput).toBeTruthy();

        lookup._needSetFocusInInput = false;
        lookup._options.multiSelect = true;
        lookup._activateLookup();
        expect(isActivate).toBeTruthy();
        expect(lookup._needSetFocusInInput).toBeTruthy();
    });

    it('_isInputActive', () => {
        let inputIsVisible = true;
        lookup._items = getItems(0);

        lookup._isInputVisible = () => {
            return inputIsVisible;
        };

        expect(lookup._isInputActive({ readOnly: false })).toBeTruthy();
        expect(!lookup._isInputActive({ readOnly: true })).toBeTruthy();

        inputIsVisible = false;
        lookup._items = getItems(1);
        expect(!lookup._isInputActive({ readOnly: false })).toBeTruthy();
        expect(!lookup._isInputActive({ readOnly: true })).toBeTruthy();
    });

    it('_isShowCollection', () => {
        lookup._maxVisibleItems = 1;
        lookup._options = {
            readOnly: false,
        };
        lookup._items = getItems(1);

        expect(!!lookup._isShowCollection()).toBeTruthy();

        lookup._maxVisibleItems = null;
        expect(!!!lookup._isShowCollection()).toBeTruthy();

        lookup._options.readOnly = true;
        expect(!!lookup._isShowCollection()).toBeTruthy();

        lookup._items = getItems(0);
        expect(!!!lookup._isShowCollection()).toBeTruthy();
    });

    it('_itemClick', () => {
        let isNotifyItemClick = false;
        lookup._suggestState = true;
        lookup._notify = (eventName) => {
            if (eventName === 'itemClick') {
                isNotifyItemClick = true;
            }
        };

        lookup._itemClick();
        expect(!lookup._suggestState).toBeTruthy();
        expect(isNotifyItemClick).toBeTruthy();
    });

    it('_crossClick', () => {
        lookup._beforeMount({ selectedKeys: [] });

        jest.spyOn(lookup, '_removeItem').mockImplementation();
        jest.spyOn(lookup, 'activate').mockImplementation();
        lookup.saveOptions({
            multiSelect: false,
        });

        lookup._crossClick({}, 'testItem');

        expect(lookup._removeItem).toHaveBeenCalledWith('testItem');
        expect(lookup._needSetFocusInInput).toBeTruthy();

        lookup.saveOptions({
            multiSelect: true,
        });
        lookup._needSetFocusInInput = false;

        lookup._crossClick({}, 'testItem');
        expect(lookup.activate).toHaveBeenCalledWith({
            enableScreenKeyboard: false,
        });
        expect(lookup._needSetFocusInInput).toBeTruthy();
    });

    it('_resize', () => {
        const oldFieldWrapperWidth = 500;
        let newFieldWrapperWidth = 500;
        let isCalculatingSizes = false;
        let wrapperWidthCalled = false;

        lookup._isNeedCalculatingSizes = () => {
            return true;
        };
        lookup._getFieldWrapperWidth = (recount) => {
            wrapperWidthCalled = true;
            return recount ? newFieldWrapperWidth : oldFieldWrapperWidth;
        };
        lookup._calculateSizes = () => {
            isCalculatingSizes = true;
        };

        lookup._fieldWrapperWidth = oldFieldWrapperWidth;
        lookup._resize();
        expect(!isCalculatingSizes).toBeTruthy();

        newFieldWrapperWidth = 0;
        lookup._resize();
        expect(!isCalculatingSizes).toBeTruthy();

        newFieldWrapperWidth = 400;
        lookup._resize();
        expect(isCalculatingSizes).toBeTruthy();
        expect(wrapperWidthCalled).toBeTruthy();

        wrapperWidthCalled = false;
        lookup._isNeedCalculatingSizes = () => {
            return false;
        };
        lookup._resize();
        expect(!wrapperWidthCalled).toBeTruthy();
    });

    it('_getFieldWrapperWidth', () => {
        let wrappedWidth;

        jest.spyOn(lookup, '_getFieldWrapper').mockImplementation();
        jest.spyOn(DOMUtil, 'width').mockImplementation(() => {
            return wrappedWidth;
        });

        wrappedWidth = 100;
        expect(lookup._getFieldWrapperWidth() === wrappedWidth).toBeTruthy();
        expect(lookup._fieldWrapperWidth === wrappedWidth).toBeTruthy();

        wrappedWidth = -10;
        lookup._fieldWrapperWidth = null;
        expect(lookup._getFieldWrapperWidth() === wrappedWidth).toBeTruthy();
        expect(lookup._fieldWrapperWidth === null).toBeTruthy();
    });
});
