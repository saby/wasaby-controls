import { FilterHistory } from 'Controls/filter';
import { constants } from 'Env/Env';
import { FilterSource } from 'Controls/history';

describe('getFilterHistorySource', () => {
    const historyId = 'TEST_HISTORY_ID_UTILS';

    it('getFilterHistorySource', function () {
        const isServerSide = constants.isServerSide;
        constants.isServerSide = false;
        const hSource = FilterHistory.getFilterHistorySource({
            historyId,
        });
        expect(hSource instanceof FilterSource).toBe(true);
        const hSource2 = FilterHistory.getFilterHistorySource({
            historyId,
        });
        expect(hSource === hSource2).toBe(true);
        constants.isServerSide = isServerSide;
    });

    it('getFilterHistorySource isServerSide', function () {
        const hSource = FilterHistory.getFilterHistorySource({
            historyId,
        });
        const hSource2 = FilterHistory.getFilterHistorySource({
            historyId,
        });
        expect(hSource === hSource2).toBe(true);
    });

    describe('minimizeItem', () => {
        let filterButtonItem;
        let expectedMinItem;

        it('item with name', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                textValue: 'textTextValue',
                resetValue: '',
                visibility: true,
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
                textValue: 'textTextValue',
                visibility: true,
            };

            const resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });
        it('item is reseted', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                resetValue: 'testValue4',
                visibility: true,
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                visibility: true,
            };
            const resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });

        it('item without textValue', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                textValue: null,
                visibility: true,
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
                visibility: false,
            };
            const resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });

        it('У элемента есть value, но textValue передано как null', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                textValue: null,
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
                textValue: null,
            };
            const resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });

        it('item with editorTemplateName', () => {
            let resultItem;
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                visibility: false,
                editorTemplateName: 'test',
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
            };
            resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);

            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                visibility: true,
                editorTemplateName: 'test',
                textValue: 'testTextValue',
                filterVisibilityCallback: () => {
                    return true;
                },
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
                textValue: 'testTextValue',
                visibility: true,
            };
            resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });
    });

    describe('minimizeFilterDescription', () => {
        it('item with historyId is reseted', () => {
            const filterButtonItems = [
                {
                    name: 'testId4',
                    value: 'testValue4',
                    resetValue: 'testValue4',
                    visibility: true,
                    viewMode: 'basic',
                    historyId: 'itemHistoryId',
                },
            ];
            const expectedMinItems = [
                {
                    name: 'testId4',
                    visibility: true,
                    historyId: 'itemHistoryId',
                },
            ];
            const resultItems = FilterHistory.minimizeFilterDescription(filterButtonItems);
            expect(resultItems).toEqual(expectedMinItems);
        });
    });
});
