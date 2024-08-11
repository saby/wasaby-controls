import { FilterDescription, IFilterItem } from 'Controls/filter';
import 'ControlsUnit/Filter/Utils/FilterVisibilityCallback';
import 'ControlsUnit/Filter/Utils/filterChangedCallback';
import { query } from 'Application/Env';
import { MaskResolver } from 'Router/router';

describe('Controls/filter:FilterDescription', () => {
    it('mergeFilterDescriptions', () => {
        let items = [
            {
                name: 'testId',
                value: '',
                textValue: '',
                resetValue: '',
            },
            {
                name: 'testId2',
                value: 'testValue',
                textValue: '',
                resetValue: '',
                visibility: false,
            },
            {
                name: 'testId3',
                value: 'testValue2',
                textValue: 'textTextValue',
                resetValue: '',
            },
            {
                name: 'testId4',
                value: 'testValue2',
                resetValue: '',
                visibility: true,
            },
        ];

        let history = [
            {
                name: 'testId',
                value: 'testValue',
                resetValue: '',
                textValue: 'textTextValue',
            },
            {
                name: 'testId2',
                value: 'testValue1',
                resetValue: '',
                textValue: '',
                visibility: true,
            },
            {
                name: 'testId4',
                value: 'testValue1',
                resetValue: '',
                textValue: '',
                visibility: undefined,
            },
        ];

        let result = [
            {
                name: 'testId',
                value: 'testValue',
                textValue: 'textTextValue',
                resetValue: '',
            },
            {
                name: 'testId2',
                value: 'testValue1',
                textValue: '',
                resetValue: '',
                visibility: true,
            },
            {
                name: 'testId3',
                value: 'testValue2',
                textValue: 'textTextValue',
                resetValue: '',
            },
            {
                name: 'testId4',
                value: 'testValue1',
                textValue: '',
                resetValue: '',
                visibility: undefined,
            },
        ];

        FilterDescription.mergeFilterDescriptions(items, history);
        expect(result).toEqual(items);

        items = [
            {
                name: 'testId',
                value: '',
                textValue: '',
                resetValue: '',
                viewMode: 'extended',
                anyField: 'anyValue123',
            },
        ];

        history = [
            {
                name: 'testId',
                value: 'testValue',
                resetValue: '',
                textValue: 'textTextValue',
                anyField: 'anyValue',
                viewMode: 'frequent',
            },
        ];

        result = [
            {
                name: 'testId',
                value: 'testValue',
                textValue: 'textTextValue',
                resetValue: '',
                viewMode: 'extended',
                anyField: 'anyValue',
            },
        ];
        FilterDescription.mergeFilterDescriptions(items, history);
        expect(result).toEqual(items);
    });
    it('isEqualItems', () => {
        let filter1 = { name: '1' } as IFilterItem;
        let filter2 = { name: '1' } as IFilterItem;
        expect(FilterDescription.isEqualItems(filter1, filter2)).toBe(true);

        filter1 = { name: '2' } as IFilterItem;
        expect(FilterDescription.isEqualItems(filter1, filter2)).toBe(false);

        filter1 = { name: '2' } as IFilterItem;
        filter2 = { name: '1' } as IFilterItem;
        expect(FilterDescription.isEqualItems(filter1, filter2)).toBe(false);

        filter2 = { name: '2' } as IFilterItem;
        expect(FilterDescription.isEqualItems(filter1, filter2)).toBe(true);
    });

    describe('Callbacks on filterDescriptions', () => {
        const filterChangedCallback = 'ControlsUnit/Filter/Utils/filterChangedCallback';
        const filterVisibilityCallback = 'ControlsUnit/Filter/Utils/FilterVisibilityCallback';

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

            const newItem = FilterDescription.getItemOnFilterChangedCallback(
                items[0],
                updatedFilter,
                changedFilters
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
            const newItem = FilterDescription.getItemOnFilterChangedCallback(
                items[0],
                updatedFilter,
                changedFilters
            );
            expect(newItem).toEqual({ name: 'testName', value: 3 });
        });

        it('getItemVisibility false', () => {
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
            const visibility = FilterDescription.getItemVisibility(
                items[0],
                updatedFilter,
                changedFilters,
                filterVisibilityCallback
            );
            expect(visibility).toBe(false);
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

            FilterDescription.callCallbacksOnFilterDescription(
                changedFilters,
                updatedFilter,
                items,
                updateCallback
            );
        });
    });
    describe('isFilterItemChanged', () => {
        it('value equal resetValue', () => {
            const filterDescriptionItem = {
                name: 'test',
                value: [],
                resetValue: [],
            };
            expect(FilterDescription.isFilterItemChanged(filterDescriptionItem)).toBe(false);
        });

        it('value not equal resetValue', () => {
            const filterDescriptionItem = {
                name: 'test',
                value: ['test'],
                resetValue: [],
            };
            expect(FilterDescription.isFilterItemChanged(filterDescriptionItem)).toBe(true);
        });

        it('filterItem without resetValue', () => {
            const filterDescriptionItem = {
                name: 'test',
                value: ['test'],
            };
            expect(FilterDescription.isFilterItemChanged(filterDescriptionItem)).toBe(true);
        });

        it('filterItem with emptyValue', () => {
            const filterDescriptionItem = {
                name: 'test',
                value: undefined,
            };
            expect(FilterDescription.isFilterItemChanged(filterDescriptionItem)).toBe(false);
        });
    });
    describe('getQueryParamsByFilterDescription', () => {
        it('Empty filterDescription', () => {
            expect(FilterDescription.getQueryParamsByFilterDescription([])).toEqual({});
        });

        it('Not empty filterDescription', () => {
            const queryParams = FilterDescription.getQueryParamsByFilterDescription([
                {
                    name: 'testName',
                    value: 'testValue',
                    textValue: 'testText',
                    resetValue: null,
                },
                {
                    name: 'testName2',
                    value: { value: 'testValue' },
                    textValue: 'testText',
                    resetValue: null,
                },
                {
                    name: 'testName',
                    value: [{ value: 'testValue' }],
                    textValue: 'testText',
                    resetValue: null,
                    visibility: true,
                },
            ]);
            const expected = {
                filter:
                    '[{"name":"testName","value":"testValue","textValue":"testText","visibility":"$u"}' +
                    ',{"name":"testName2","value":{"value":"testValue"},"textValue":"testText",' +
                    '"visibility":"$u"},{"name":"testName","value":[{"value":"testValue"}],' +
                    '"textValue":"testText","visibility":true}]',
            };

            expect(queryParams).toEqual(expected);
        });
    });
    it('getFilterFromUrl', () => {
        const urlFilter = {
            filter:
                '%5B%7B%22name%22%3A%22Organization%22%2C%22value%22%3A21391705%2C%22textValue' +
                '%22%3A%22%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A2%D0%95%D0%A1%D0%A2%22%7D%5D',
        };
        jest.spyOn(query, 'get', 'get').mockReturnValue(urlFilter);

        expect(FilterDescription.getFilterFromURL([{ saveToUrl: true }], true)).toEqual([
            {
                name: 'Organization',
                value: 21391705,
                textValue: 'НОВЫЙ ТЕСТ',
            },
        ]);
    });
    it('applyFilterDescriptionToURL', () => {
        const items = [
            {
                name: 'testName',
                value: 'testValue',
                textValue: 'testText',
                resetValue: null,
                visibility: true,
            },
        ];
        const queryParams = FilterDescription.getQueryParamsByFilterDescription(items);
        const state = MaskResolver.calculateQueryHref(queryParams);

        expect(queryParams).toEqual({
            filter:
                '[{"name":"testName","value":"testValue",' +
                '"textValue":"testText","visibility":true}]',
        });
        expect(state).toEqual(
            '/?filter=%5B%7B%22name%22%3A%22testName%22%2C%22value%22%3A%22testValue' +
                '%22%2C%22textValue%22%3A%22testText%22%2C%22visibility%22%3Atrue%7D%5D'
        );
    });
    it('hasResetValue', function () {
        let items = [
            {
                id: 'text',
                value: 'value1',
                resetValue: 'resetValue1',
            },
            {
                id: 'boolean',
                value: 'value2',
                resetValue: 'resetValue2',
            },
        ];
        let result = FilterDescription.hasResetValue(items);
        expect(result).toBe(true);

        items = [
            {
                id: 'text',
                value: 'value1',
            },
            {
                id: 'boolean',
                value: 'value2',
            },
        ];
        result = FilterDescription.hasResetValue(items);
        expect(result).toBe(false);
    });

    it('resetFilterDescription', function () {
        const items = [
            {
                id: 'text',
                value: 'value1',
                resetValue: 'resetValue1',
                visibility: undefined,
            },
            {
                id: 'boolean',
                value: 'value2',
                resetValue: 'resetValue2',
                textValue: '123',
                visibility: undefined,
                viewMode: 'basic',
                editorOptions: {
                    extendedCaption: 'testExtendedCaption',
                },
            },
            {
                id: 'Array',
                value: 'resetValue3',
                resetValue: 'resetValue3',
                viewMode: 'extended',
                visibility: true,
            },
            {
                id: 'Number',
                value: 'value4',
                resetValue: 'resetValue4',
                visibility: false,
            },
            {
                id: 'Object',
                value: 'value5',
                resetValue: 'resetValue5',
                textValue: null,
                visibility: false,
            },
        ];

        const expectedItems = [
            {
                id: 'text',
                value: 'resetValue1',
                resetValue: 'resetValue1',
                visibility: undefined,
            },
            {
                id: 'boolean',
                value: 'resetValue2',
                resetValue: 'resetValue2',
                textValue: '',
                visibility: undefined,
                viewMode: 'extended',
                editorOptions: {
                    extendedCaption: 'testExtendedCaption',
                },
            },
            {
                id: 'Array',
                value: 'resetValue3',
                resetValue: 'resetValue3',
                viewMode: 'extended',
                visibility: false,
            },
            {
                id: 'Number',
                value: 'resetValue4',
                resetValue: 'resetValue4',
                visibility: false,
            },
            {
                id: 'Object',
                value: 'resetValue5',
                resetValue: 'resetValue5',
                textValue: null,
                visibility: false,
            },
        ];

        FilterDescription.resetFilterDescription(items);
        expect(items).toEqual(expectedItems);
    });

    describe('applyFilterUserHistoryToDescription', () => {
        it('viewMode из параметров применяется к filterDescription', () => {
            const filterDescription = [
                {
                    name: 'testName',
                    value: null,
                    resetValue: null,
                    viewMode: 'basic',
                },
            ];
            const userFilterConfig = [
                {
                    name: 'testName',
                    viewMode: 'extended',
                },
            ];

            const result = FilterDescription.applyFilterUserHistoryToDescription(
                filterDescription,
                userFilterConfig
            );

            expect(result[0].viewMode).toEqual('extended');
        });

        it('viewMode сохранено для редактора в панели и применяется к filterDescription', () => {
            const filterDescription = [
                {
                    name: 'testName',
                    value: null,
                    resetValue: null,
                    viewMode: 'basic',
                    panel: {
                        viewMode: 'basic',
                    },
                },
            ];
            const userFilterConfig = [
                {
                    name: 'testName',
                    panel: {
                        viewMode: 'extended',
                    },
                },
            ];

            const result = FilterDescription.applyFilterUserHistoryToDescription(
                filterDescription,
                userFilterConfig
            );

            expect(result[0].viewMode).toEqual('basic');
            expect(result[0].panel.viewMode).toEqual('extended');
        });

        it('в filterDescription нет сохранённого параметра', () => {
            const filterDescription = [
                {
                    name: 'testName',
                    value: null,
                    resetValue: null,
                    viewMode: 'basic',
                },
            ];
            const userFilterConfig = [
                {
                    name: 'anotherName',
                    viewMode: 'extended',
                },
            ];

            const result = FilterDescription.applyFilterUserHistoryToDescription(
                filterDescription,
                userFilterConfig
            );

            expect(result[0].viewMode).toEqual('basic');
        });
    });
});
