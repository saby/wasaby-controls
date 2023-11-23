import { RecordSet } from 'Types/collection';
import { getBottomPaddingClassUtil } from 'Controls/baseList';

describe('Controls/baseList/getBottomPaddingClassUtils', function () {
    const data = [
        {
            id: 1,
            title: 'Первый',
            type: 1,
        },
        {
            id: 2,
            title: 'Второй',
            type: 2,
        },
        {
            id: 3,
            title: 'Третий',
            type: 2,
        },
    ];
    const items = new RecordSet({
        keyProperty: 'id',
        rawData: data,
    });
    const emptyItems = new RecordSet({
        keyProperty: 'id',
        rawData: [],
    });
    const params = {
        items,
        hasModel: true,
        hasFooter: false,
        hasResults: false,
        hasPaging: false,
        resultsPosition: 'top',
        itemActionsPosition: 'outside',
        bottomPaddingMode: undefined,
    };
    test('default actions mode', function () {
        const newParams = { ...params };
        expect(getBottomPaddingClassUtil(newParams)).toEqual(
            'controls-itemActionsV_outside-spacing'
        );
    });
    test('list model undefined', function () {
        const newParams = { ...params, hasModel: false };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
    test('items undefined', function () {
        const newParams = { ...params, items: undefined };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
    test('empty items', function () {
        const newParams = { ...params, items: emptyItems };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
    test('placeholder mode', function () {
        const newParams = { ...params, bottomPaddingMode: 'placeholder' };
        expect(getBottomPaddingClassUtil(newParams)).toEqual(
            'controls-ListViewV__placeholderAfterContent'
        );
    });
    test('has footer', function () {
        const newParams = { ...params, hasFooter: true };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
    test('has bottom results', function () {
        const newParams = { ...params, hasResults: true, resultsPosition: 'bottom' };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
    test('has top results', function () {
        const newParams = { ...params, hasResults: true };
        expect(getBottomPaddingClassUtil(newParams)).toEqual(
            'controls-itemActionsV_outside-spacing'
        );
    });
    test('basic mode', function () {
        const newParams = { ...params, bottomPaddingMode: 'basic' };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
    test('additional mode', function () {
        const newParams = {
            ...params,
            itemActionsPosition: undefined,
            bottomPaddingMode: 'additional',
        };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('controls-ListView_outside-spacing');
    });
    test('additional mode with paging', function () {
        const newParams = {
            ...params,
            itemActionsPosition: undefined,
            bottomPaddingMode: 'additional',
            hasPaging: true,
        };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
});
