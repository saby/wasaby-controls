import { getBottomPaddingClassUtil } from 'Controls/baseList';

describe('Controls/baseList/getBottomPaddingClassUtils', function () {
    const params = {
        hasItems: true,
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
    test('items undefined or empty', function () {
        const newParams = { ...params, hasItems: false };
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
    test('none mode', function () {
        const newParams = { ...params, bottomPaddingMode: 'none' };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
    test('none mode with paging', function () {
        const newParams = { ...params, bottomPaddingMode: 'none', hasPaging: true };
        expect(getBottomPaddingClassUtil(newParams)).toEqual(
            'controls-itemActionsV_outside-spacing'
        );
    });
    test('separate mode', function () {
        const newParams = {
            ...params,
            itemActionsPosition: undefined,
            bottomPaddingMode: 'separate',
        };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('controls-ListView_outside-spacing');
    });
    test('separate mode with paging', function () {
        const newParams = {
            ...params,
            itemActionsPosition: undefined,
            bottomPaddingMode: 'separate',
            hasPaging: true,
        };
        expect(getBottomPaddingClassUtil(newParams)).toEqual('');
    });
    test('editing item in adaptive', function () {
        const newParams = {
            ...params,
            isTouch: true,
            isEditing: true,
        };
        expect(getBottomPaddingClassUtil(newParams)).toEqual(
            'controls-itemActionsV_outside-spacing'
        );
    });
});
