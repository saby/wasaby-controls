import { FilterHistory } from 'Controls/filter';
import { Store } from 'Controls/HistoryStore';
import { LocalStorage } from 'Browser/Storage';

describe('getFilterHistorySource', () => {
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

    describe('getItemsByHistory', () => {
        const TEST_HISTORY_ID = 'testHistoryId';
        function getFilterDescription() {
            return [{ name: 'test', value: true, resetValue: false }];
        }
        beforeEach(() => {
            new LocalStorage().clear();
        });
        it('В истории только недавно выбранные', async () => {
            for (let i = 0; i < 20; i++) {
                const filterDescription = getFilterDescription();
                filterDescription[0].name = `test-${i}`;
                await Store.push(TEST_HISTORY_ID, filterDescription);
            }
            const items = FilterHistory.getItemsByHistory(
                TEST_HISTORY_ID,
                FilterHistory.MAX_HISTORY
            );
            expect(items.getCount()).toEqual(FilterHistory.MAX_HISTORY);
        });
        it('В истории запиненные и недавно выбранные', async () => {
            for (let i = 0; i < 12; i++) {
                const filterDescription = getFilterDescription();
                filterDescription[0].name = `test-${i}`;
                const historyItemId = await Store.push(TEST_HISTORY_ID, filterDescription);

                if (i % 2) {
                    await Store.togglePin(TEST_HISTORY_ID, historyItemId);
                }
            }
            const items = FilterHistory.getItemsByHistory(
                TEST_HISTORY_ID,
                FilterHistory.MAX_HISTORY
            );
            expect(items.getCount()).toEqual(FilterHistory.MAX_HISTORY);
            expect(items.at(5).get('pinned')).toBeTruthy();
            expect(items.at(6).get('pinned')).toBeFalsy();
        });
        it('В истории 10 запиненных', async () => {
            for (let i = 0; i < 20; i++) {
                const filterDescription = getFilterDescription();
                filterDescription[0].name = `test-${i}`;
                const historyItemId = await Store.push(TEST_HISTORY_ID, filterDescription);

                if (i % 2) {
                    await Store.togglePin(TEST_HISTORY_ID, historyItemId);
                }
            }
            const items = FilterHistory.getItemsByHistory(
                TEST_HISTORY_ID,
                FilterHistory.MAX_HISTORY
            );
            expect(items.getCount()).toEqual(FilterHistory.MAX_HISTORY);
            expect(items.at(9).get('pinned')).toBeTruthy();
        });
    });
});
