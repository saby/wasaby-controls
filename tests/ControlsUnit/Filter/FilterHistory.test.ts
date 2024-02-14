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
        it('item with id', () => {
            filterButtonItem = {
                id: 'testId4',
                value: 'testValue4',
                textValue: 'textValue',
                resetValue: '',
                visibility: true,
            };
            expectedMinItem = {
                id: 'testId4',
                value: 'testValue4',
                textValue: 'textValue',
                visibility: true,
            };

            const resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });

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
                viewMode: 'basic',
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
                visibility: false,
                viewMode: 'basic',
            };
            const resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });

        it('item without textValue', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                visibility: true,
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
                visibility: false,
                viewMode: 'basic',
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
                viewMode: 'basic',
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
                viewMode: 'basic',
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
                viewMode: 'basic',
                textValue: 'testTextValue',
                visibility: true,
            };
            resultItem = FilterHistory.minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });
    });
});
