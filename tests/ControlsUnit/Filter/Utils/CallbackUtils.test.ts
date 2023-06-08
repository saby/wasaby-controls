import {
    getChangedFilters,
    getItemOnFilterChangedCallback,
    getItemVisivbility,
    loadCallbacks,
    callCallbacksOnFilterDescriptionItems,
} from 'Controls/_filter/Utils/CallbackUtils';

describe('Controls/_filter/Utils/CallbackUtils', () => {
    const filterChangedCallback =
        'ControlsUnit/Filter/Utils/filterChangedCallback';
    const filterVisibilityCallback =
        'ControlsUnit/Filter/Utils/FilterVisibilityCallback';
    it('filters dont changed', () => {
        const currentFilter = {};
        const updatedFilter = {};
        expect(getChangedFilters(currentFilter, updatedFilter)).toEqual({});
    });

    it('filters are changed', () => {
        const currentFilter = { test: 'firstValue' };
        const updatedFilter = { test: 'secondValue' };
        expect(getChangedFilters(currentFilter, updatedFilter)).toEqual({
            test: 'secondValue',
        });
    });

    it('getItemOnFilterChangedCallback with needed value', () => {
        const updatedFilter = { value: 2 };
        const changedFilters = {
            testValue: 2,
        };
        const items = [
            {
                name: 'testName',
                value: 1,
                filterChangedCallback,
            },
        ];
        loadCallbacks(items);
        const newItem = getItemOnFilterChangedCallback(
            items[0],
            updatedFilter,
            changedFilters,
            filterChangedCallback
        );
        expect(newItem).toEqual({ name: 'testName', value: 2 });
    });

    it('getItemOnFilterChangedCallback with new value', () => {
        const updatedFilter = { value: 2 };
        const changedFilters = {
            testValue: 1,
        };
        const items = [
            {
                name: 'testName',
                value: 1,
                filterChangedCallback,
            },
        ];
        loadCallbacks(items);
        const newItem = getItemOnFilterChangedCallback(
            items[0],
            updatedFilter,
            changedFilters,
            filterChangedCallback
        );
        expect(newItem).toEqual({ name: 'testName', value: 3 });
    });

    it('getItemVisivbility false', () => {
        const updatedFilter = { value: 2 };
        const changedFilters = {
            testValue: 1,
        };
        const items = [
            {
                name: 'testName',
                value: 1,
                filterVisibilityCallback,
            },
        ];
        loadCallbacks(items);
        const visivbility = getItemVisivbility(
            items[0],
            updatedFilter,
            changedFilters,
            filterVisibilityCallback
        );
        expect(visivbility).toBe(false);
    });

    it('callCallbacksOnFilterDescriptionItems without filterVisibilityCallback', () => {
        const updatedFilter = { value: 2 };
        const changedFilters = {
            testValue: 1,
        };
        const items = [
            {
                name: 'testName',
                value: 1,
                visibility: true,
            },
        ];
        const updateCallback = (newFilterDescription) => {
            expect(newFilterDescription[0].visibility).toBe(true);
        };
        loadCallbacks(items);
        callCallbacksOnFilterDescriptionItems(
            changedFilters,
            updatedFilter,
            items,
            updateCallback
        );
    });
});
