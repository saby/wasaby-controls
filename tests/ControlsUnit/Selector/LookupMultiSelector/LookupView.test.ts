import { default as Lookup } from 'Controls/_multipleLookupOld/Input';
import { Model } from 'Types/entity';
import { List } from 'Types/collection';
import * as getWidthUtil from 'Controls/sizeUtils';

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

describe('Controls/_lookup/MultipleInput/LookupView', () => {
    it('getAvailableWidthCollection', () => {
        const placeholderWidth = 35;
        const fieldWrapperWidth = 145;
        const lookupView = new Lookup();
        const originGetWidth = getWidthUtil.getWidth;
        const placeholder = 'testPlaceholder';
        // Избавимся от работы с версткой
        delete getWidthUtil.getWidth;
        getWidthUtil.getWidth = () => {
            return placeholderWidth;
        };
        delete lookupView._getFieldWrapperWidth;
        lookupView._getFieldWrapperWidth = () => {
            return fieldWrapperWidth;
        };
        delete lookupView._initializeConstants;
        lookupView._initializeConstants = jest.fn();

        lookupView._items = getItems(3);
        expect(
            lookupView._getAvailableWidthCollection({
                maxVisibleItems: 3,
                placeholder,
            })
        ).toBe(fieldWrapperWidth);

        lookupView._items = getItems(2);
        expect(
            lookupView._getAvailableWidthCollection({
                maxVisibleItems: 3,
                placeholder,
            })
        ).toBe(fieldWrapperWidth - placeholderWidth);
        getWidthUtil.getWidth = originGetWidth;
    });

    it('_calculateSizes', () => {
        const availableWidthCollection = 200;
        const lookupView = new Lookup({});

        lookupView._getAvailableWidthCollection = () => {
            return availableWidthCollection;
        };
        lookupView._items = getItems(2);
        lookupView._calculateSizes({
            maxVisibleItems: 5,
        });
        expect(lookupView._maxVisibleItems).toBe(2);
        expect(lookupView._availableWidthCollection).toBe(availableWidthCollection);
    });

    it('_isInputVisible', () => {
        const lookupView = new Lookup();

        lookupView._items = getItems(5);
        lookupView._options.maxVisibleItems = 5;
        expect(lookupView._isInputVisible(lookupView._options)).toBe(false);

        lookupView._options.maxVisibleItems = 6;
        expect(lookupView._isInputVisible(lookupView._options)).toBe(true);

        lookupView._options.readOnly = true;
        expect(lookupView._isInputVisible(lookupView._options)).toBeUndefined();
    });

    it('_isNeedCalculatingSizes', () => {
        const lookupView = new Lookup();

        lookupView._items = getItems(0);
        expect(lookupView._isNeedCalculatingSizes({})).toBe(false);

        lookupView._items = getItems(5);
        expect(lookupView._isNeedCalculatingSizes({})).toBe(true);

        lookupView._items = getItems(5);
        expect(
            lookupView._isNeedCalculatingSizes({
                readOnly: true,
            })
        ).toBe(false);
    });

    it('showSelector retunrs boolean result', () => {
        const lookupView = new Lookup();
        let suggestClosed = false;
        lookupView.saveOptions({
            selectorTempalte: null,
        });
        lookupView._children = {
            layout: {
                closeSuggest: () => {
                    suggestClosed = true;
                },
            },
        };
        lookupView._suggestState = true;
        expect(lookupView.showSelector()).toBe(true);
        expect(lookupView._suggestState).toBeFalsy();
        expect(suggestClosed).toBe(true);
    });
});
