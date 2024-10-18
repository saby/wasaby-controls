import { Control } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/FilterView';
import { Memory } from 'Types/source';
import { Service } from 'Controls/historyOld';
import * as Clone from 'Core/core-clone';
import HierarchyHistoryMemory from 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/hierarchyHistoryMemory';
import * as hierarchyMemory from 'Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/hierarchyMemory';
import * as memorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';
import * as historySourceFast from 'Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/historySourceFast';
import { companies } from 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/DataStorage';
import 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/itemTemplatePhoto';
import 'css!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/FilterView';
import {
    getCategoryItems,
    getHierarchyData,
    getHierarchyData2,
    getMultiSelectItems,
} from 'Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/GetItems';
import { IFilterItem } from 'Controls/filter';

const operationData = [
    {
        id: 1,
        title: 'Task',
        '@parent': true,
        parent: null,
    },
    {
        id: 2,
        title: 'Error in the development',
        '@parent': null,
        parent: null,
    },
    {
        id: 3,
        title: 'Commission',
        parent: 1,
        '@parent': null,
    },
    {
        id: 4,
        title: 'Coordination',
        parent: 1,
        '@parent': true,
    },
    {
        id: 5,
        title: 'Application',
        parent: 1,
        '@parent': null,
    },
    {
        id: 6,
        title: 'Development',
        parent: 1,
        '@parent': null,
    },
    {
        id: 7,
        title: 'Exploitation',
        parent: 1,
        '@parent': null,
    },
    {
        id: 8,
        title: 'Coordination',
        parent: 4,
        '@parent': null,
    },
    {
        id: 9,
        title: 'Negotiate the discount',
        parent: 4,
        '@parent': null,
    },
    {
        id: 10,
        title: 'Coordination of change prices',
        parent: 4,
        '@parent': null,
    },
    {
        id: 11,
        title: 'Matching new dish',
        parent: 4,
        '@parent': null,
    },
];

export default class RichDemoIndex extends Control {
    protected _template = template;
    protected _defaultSource = new Memory({
        keyProperty: 'id',
        data: [
            { id: null, title: 'All documents' },
            { id: 1, title: 'My' },
            { id: 2, title: 'My department' },
        ],
    });
    protected _hierarchyItems: IFilterItem[];
    protected _hierarchyItems2: IFilterItem[];
    protected _hierarchyDataSource: IFilterItem[];
    protected _hierarchyDataSource2: IFilterItem[];
    protected _navigation = {
        source: 'page',
        view: 'page',
        sourceConfig: { pageSize: 4, page: 0, hasMore: false },
    };
    protected _itemsMore: IFilterItem[];
    protected _buttonItems: IFilterItem[];
    protected _buttonItemsWithoutResetValue: IFilterItem[];
    protected _fastButtonItems: IFilterItem[];
    protected _fastButtonItems2: IFilterItem[];
    protected _fastButtonItems3: IFilterItem[];
    protected _oneFastItems: IFilterItem[];
    protected _oneFastItems2: IFilterItem[];
    protected _customTemplateItems: IFilterItem[];
    protected _scrollFastItems: IFilterItem[];
    protected _historyFastItems: IFilterItem[];
    protected _filterText: string = '';
    protected _fastItems: IFilterItem[];

    _beforeMount() {
        this._hierarchyDataSource = getHierarchyData();
        this._hierarchyDataSource2 = getHierarchyData2();
        this._hierarchyItems = [
            {
                name: 'hierarchyOperations',
                value: {},
                resetValue: {},
                emptyText: 'All operations',
                editorOptions: {
                    displayProperty: 'title',
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: '@parent',
                    source: new HierarchyHistoryMemory({
                        originSource: new Memory({
                            keyProperty: 'id',
                            data: this._hierarchyDataSource,
                            filter: () => true,
                        }),
                        historySource: new Service({
                            historyId: 'DEMO_HISTORY_ID',
                        }),
                    }),
                    filter: { $_history: true },
                    selectorTemplate: {
                        templateName:
                            'Controls-ListEnv-demo/Filter/NotConnectedView/resources/TreeStack/TreeStackTemplate',
                        templateOptions: {
                            items: this._hierarchyDataSource,
                            nodeProperty: '@parent',
                            parentProperty: 'parent',
                            multiSelect: true,
                        },
                    },
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: { pageSize: 8, page: 0 },
                    },
                    selectorTemplateName:
                        'Controls-ListEnv-demo/Filter/NotConnectedView/resources/TreeStack/TreeStackTemplate',
                    suggestTemplateName: 'Controls-demo/Input/Lookup/Suggest/SuggestTemplate',
                    className: 'controls-demo-FilterView__lookupTemplate',
                    caption: 'Our company',
                    placeholder: 'Enter company name',
                    searchParam: 'title',
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
            {
                name: 'lists',
                value: { Список1: ['Список1'], Список2: ['21', '22'] },
                resetValue: null,
                emptyText: 'All',
                editorOptions: {
                    displayProperty: 'title',
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: '@parent',
                    source: new HierarchyHistoryMemory({
                        originSource: new Memory({
                            keyProperty: 'id',
                            data: this._hierarchyDataSource2,
                            filter: () => true,
                        }),
                        historySource: new Service({
                            historyId: 'DEMO_HISTORY_ID',
                        }),
                    }),
                    filter: { $_history: true },
                    selectorTemplate: {
                        templateName:
                            'Controls-ListEnv-demo/Filter/NotConnectedView/resources/TreeStack/TreeStackTemplate',
                        templateOptions: {
                            items: this._hierarchyDataSource2,
                            nodeProperty: '@parent',
                            parentProperty: 'parent',
                            multiSelect: true,
                        },
                    },
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: { pageSize: 8, page: 0 },
                    },
                    selectorTemplateName:
                        'Controls-ListEnv-demo/Filter/NotConnectedView/resources/TreeStack/TreeStackTemplate',
                    suggestTemplateName: 'Controls-demo/Input/Lookup/Suggest/SuggestTemplate',
                    className: 'controls-demo-FilterView__lookupTemplate',
                    caption: 'Lists',
                    placeholder: 'Enter name',
                    searchParam: 'title',
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
        ];
        this._hierarchyItems2 = [
            {
                name: 'operations',
                value: [],
                resetValue: [],
                emptyText: 'All operations',
                emptyKey: '111',
                editorOptions: {
                    displayProperty: 'title',
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: '@parent',
                    source: new hierarchyMemory({
                        keyProperty: 'id',
                        data: this._hierarchyDataSource,
                        filter: () => true,
                    }),
                    selectorTemplate: {
                        templateName:
                            'Controls-ListEnv-demo/Filter/NotConnectedView/resources/TreeStack/TreeStackTemplate',
                        templateOptions: {
                            items: this._hierarchyDataSource,
                            nodeProperty: '@parent',
                            parentProperty: 'parent',
                            multiSelect: true,
                        },
                        popupOptions: { width: 300 },
                    },
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: { pageSize: 8, page: 0 },
                    },
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
            {
                name: 'lists',
                value: { Список1: ['Список1'], Список2: ['21'] },
                resetValue: null,
                emptyText: 'All',
                editorOptions: {
                    displayProperty: 'title',
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: '@parent',
                    source: new hierarchyMemory({
                        keyProperty: 'id',
                        data: this._hierarchyDataSource2,
                        filter: () => true,
                    }),
                    navigation: {
                        source: 'page',
                        view: 'page',
                        sourceConfig: { pageSize: 8, page: 0 },
                    },
                },
                viewMode: 'frequent',
            },
        ];
        this._fastItems = [
            {
                name: 'files',
                value: [],
                resetValue: [],
                emptyText: 'All files',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'Incoming' },
                            { id: 2, title: 'Outgoing' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
            {
                name: 'category',
                value: 1,
                resetValue: 10,
                emptyText: 'All category',
                emptyKey: 10,
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'Images' },
                            { id: 2, title: 'Documents' },
                            { id: 3, title: 'Audio/Video' },
                            { id: 4, title: '' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
            {
                name: 'city',
                value: [null],
                resetValue: [null],
                emptyText: 'Not selected',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: '1', title: 'Yaroslavl', pinned: true },
                            { id: '2', title: 'Rybinsk' },
                            { id: '3', title: 'Uglich' },
                            { id: '4', title: 'Tutaev' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
        ];
        this._itemsMore = [
            {
                name: 'region',
                value: [null],
                resetValue: [null],
                emptyText: 'all records',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: getMultiSelectItems(),
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    navigation: this._navigation,
                    selectorTemplate: {
                        templateName:
                            'Controls-ListEnv-demo/Filter/NotConnectedView/resources/stackTemplate/StackTemplate',
                        templateOptions: {
                            items: getMultiSelectItems(),
                            multiSelect: true,
                        },
                        popupOptions: { width: 300 },
                    },
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
            {
                name: 'category',
                value: 1,
                resetValue: null,
                emptyText: 'all categories',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: getCategoryItems(),
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    navigation: this._navigation,
                    selectorTemplate: {
                        templateName:
                            'Controls-ListEnv-demo/Filter/NotConnectedView/resources/stackTemplate/StackTemplate',
                        templateOptions: { items: getCategoryItems() },
                        popupOptions: { width: 500 },
                    },
                },
                viewMode: 'frequent',
            },
            {
                name: 'state',
                value: 1,
                resetValue: null,
                emptyText: 'all state',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, text: 'In any state' },
                            { id: 2, text: 'In progress' },
                            { id: 3, text: 'Completed' },
                            {
                                id: 4,
                                text: 'Completed positive',
                            },
                            {
                                id: 5,
                                text: 'Completed negative',
                            },
                            { id: 6, text: 'Deleted' },
                            { id: 7, text: 'Drafts' },
                        ],
                    }),
                    displayProperty: 'text',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];
        this._buttonItems = [
            {
                name: 'unread',
                value: true,
                resetValue: false,
                textValue: 'Unread',
                caption: 'Unread',
                viewMode: 'extended',
                visibility: false,
            },
            {
                name: 'limit',
                value: [null],
                resetValue: [null],
                textValue: 'Due date',
                viewMode: 'extended',
                visibility: false,
                source: new Memory({
                    keyProperty: 'id',
                    data: [
                        { id: 1, title: 'Due date' },
                        { id: 2, title: 'Overdue' },
                    ],
                }),
            },
            {
                name: 'sender',
                value: null,
                resetValue: '',
                viewMode: 'extended',
                visibility: false,
                source: this._defaultSource,
            },
            {
                name: 'operation',
                value: [],
                resetValue: [],
                textValue: '',
                source: this._defaultSource,
                editorOptions: {
                    selectorTemplate: {
                        templateName:
                            'Controls-ListEnv-demo/Filter/NotConnectedView/resources/TreeStack/TreeStackTemplate',
                        templateOptions: {
                            items: operationData,
                            nodeProperty: '@parent',
                            parentProperty: 'parent',
                            multiSelect: true,
                        },
                    },
                    suggestTemplateName: 'Controls-demo/Input/Lookup/Suggest/SuggestTemplate',
                    className: 'controls-demo-FilterView__lookupTemplate',
                    parentProperty: 'parent',
                    nodeProperty: '@parent',
                    caption: 'Operation',
                    multiSelect: true,
                    keyProperty: 'title',
                    placeholder: 'Specify operation name',
                    source: new Memory({
                        data: operationData,
                        keyProperty: 'id',
                        filter: memorySourceFilter(),
                    }),
                },
            },
            {
                name: 'loose',
                value: true,
                resetValue: '',
                textValue: 'Loose',
                caption: 'Loose',
                viewMode: 'extended',
                visibility: false,
            },
            {
                name: 'author',
                value: 'Ivanov K.K.',
                textValue: 'Author: Ivanov K.K.',
                resetValue: '',
                viewMode: 'basic',
            },
            {
                name: 'own',
                value: 2,
                resetValue: '',
                textValue: 'On department',
                viewMode: 'extended',
                visibility: false,
                source: new Memory({
                    keyProperty: 'id',
                    data: [
                        { id: 1, title: 'On me' },
                        { id: 2, title: 'On department' },
                    ],
                }),
            },
            {
                name: 'ourOrganisation',
                value: [],
                resetValue: [],
                textValue: '',
                viewMode: 'extended',
                visibility: false,
                editorOptions: {
                    selectorTemplate: {
                        templateName:
                            'Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector',
                        templateOptions: {
                            source: new Memory({
                                data: companies,
                                keyProperty: 'id',
                            }),
                        },
                    },
                    suggestTemplateName: 'Controls-demo/Input/Lookup/Suggest/SuggestTemplate',
                    className: 'controls-demo-FilterView__lookupTemplate',
                    caption: 'Our company',
                    placeholder: 'Enter company name',
                    keyProperty: 'id',
                    source: new Memory({
                        data: companies,
                        keyProperty: 'id',
                    }),
                },
            },
            {
                name: 'activity',
                value: [1],
                resetValue: [1],
                viewMode: 'extended',
                visibility: false,
                source: new Memory({
                    keyProperty: 'id',
                    data: [
                        { id: 1, title: 'Activity for the last month' },
                        { id: 2, title: 'Activity for the last quarter' },
                        { id: 3, title: 'Activity for the last year' },
                    ],
                }),
            },
        ];
        this._buttonItemsWithoutResetValue = Clone(this._buttonItems);
        this._buttonItemsWithoutResetValue.forEach(function (item) {
            delete item.resetValue;
        });
        this._fastButtonItems = [
            {
                name: 'date',
                resetValue: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
                value: [new Date(2019, 6, 1), new Date(2019, 6, 31)],
                type: 'dateRange',
                editorOptions: {
                    chooseHalfyears: false,
                    chooseYears: false,
                },
                viewMode: 'basic',
            },
            {
                name: 'document',
                value: null,
                resetValue: null,
                textValue: '',
                emptyText: 'All documents',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'My' },
                            { id: 2, title: 'My department' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
            {
                name: 'category',
                value: [1],
                resetValue: [null],
                textValue: '',
                emptyText: 'all categories',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            {
                                id: 1,
                                title: 'Banking and financial services, credit',
                            },
                            {
                                id: 2,
                                title: 'Gasoline, diesel fuel, light oil products',
                            },
                            { id: 3, title: 'Transportation, logistics, customs' },
                            { id: 4, title: 'Oil and oil products' },
                            { id: 5, title: 'Pipeline transportation services' },
                            {
                                id: 6,
                                title: 'Services in tailoring and repair of clothes, textiles',
                            },
                            {
                                id: 7,
                                title: 'Computers and components, computing, office equipment',
                            },
                            { id: 8, title: 'Accounting, audit' },
                            { id: 9, title: 'Marketing and social research' },
                            { id: 10, title: 'Locking and sealing products' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
            {
                name: 'state',
                value: [1],
                resetValue: [null],
                textValue: '',
                emptyText: 'all state',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'In any state' },
                            { id: 2, title: 'In progress' },
                            { id: 3, title: 'Completed' },
                            {
                                id: 4,
                                title: 'Completed positive',
                            },
                            {
                                id: 5,
                                title: 'Completed negative',
                            },
                            { id: 6, title: 'Deleted' },
                            { id: 7, title: 'Drafts' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
            {
                name: 'responsible',
                value: '',
                resetValue: '',
                viewMode: 'extended',
                visibility: false,
            },
            {
                name: 'tagging',
                value: false,
                resetValue: false,
                textValue: 'Marks',
                viewMode: 'extended',
                visibility: false,
            },
        ].concat(this._buttonItems);

        this._fastButtonItems2 = Clone(this._fastButtonItems);
        this._fastButtonItems2[0].editorOptions.editorMode = 'Selector';
        this._fastButtonItems2.push({
            name: 'detailingPeriod',
            value: [1],
            resetValue: [1],
            textValue: '',
            viewMode: 'extended',
            visibility: false,
            source: new Memory({
                keyProperty: 'key',
                data: [
                    {
                        key: 1,
                        title: 'On documents',
                        'parent@': false,
                        parent: null,
                    },
                    {
                        key: 2,
                        title: 'Summary',
                        'parent@': true,
                        parent: null,
                    },
                    {
                        key: 3,
                        title: 'Day',
                        text: 'Summary by day',
                        parent: 2,
                        'parent@': false,
                    },
                    {
                        key: 4,
                        title: 'Month',
                        text: 'Summary by monthly',
                        parent: 2,
                        'parent@': false,
                    },
                    {
                        key: 5,
                        title: 'Year',
                        text: 'Summary by year',
                        parent: 2,
                        'parent@': false,
                    },
                ],
            }),
        });

        this._fastButtonItems3 = Clone(this._fastButtonItems);
        this._fastButtonItems3[0].editorOptions.resetStartValue = null;
        this._fastButtonItems3[0].editorOptions.resetEndValue = null;

        this._oneFastItems = [
            {
                name: 'acting',
                value: '1',
                resetValue: '1',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: '1', title: 'Acting' },
                            { id: '2', title: 'All' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];
        this._oneFastItems2 = [
            {
                name: 'type',
                value: '1',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: '1', title: 'EDO' },
                            { id: '2', title: 'EDI' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];
        this._scrollFastItems = [
            {
                name: 'state',
                value: [1],
                resetValue: [null],
                textValue: '',
                emptyText: 'all state',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: this._getMultiItems(),
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    multiSelect: true,
                },
                viewMode: 'frequent',
            },
        ];
        this._customTemplateItems = [
            {
                name: 'contacts',
                value: null,
                resetValue: null,
                viewMode: 'frequent',
                emptyText: 'all contacts',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: '1', title: 'Completed contacts' },
                            { id: '2', title: 'Unrelated' },
                            { id: '3', title: 'Communication is scheduled' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
            },
            {
                name: 'employees',
                value: null,
                resetValue: null,
                viewMode: 'frequent',
                emptyText: 'all employees',
                editorOptions: {
                    source: historySourceFast.createMemory(),
                    displayProperty: 'title',
                    keyProperty: 'id',
                    itemTemplateProperty: 'itemTpl',
                },
            },
        ];
    }

    _beforeUnmount() {
        this._hierarchyItems.forEach(function (item) {
            item.editorOptions.source.destroyHistory();
        });
    }

    _getMultiItems() {
        const items = [];
        for (let i = 0; i < 100; i++) {
            items.push({ title: 'Item ' + i, id: i });
        }
        return items;
    }

    _itemsChanged(event, field, items) {
        this[field] = items;
    }
}
