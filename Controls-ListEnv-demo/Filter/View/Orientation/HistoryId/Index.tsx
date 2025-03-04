import * as React from 'react';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as ListView } from 'Controls/list';
import { Memory } from 'Types/source';
import * as filter from 'Controls-ListEnv-demo/Filter/View/HistoryId/DataFilter';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import { cities } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as dataFilter from 'Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/LookupFilter';
import { LocalStorage } from 'Browser/Storage';
import { Store } from 'Controls/HistoryStore';

new LocalStorage().clear();

Store.push('ORIENTATION_HISTORY_ID_DEMO', [
    { value: 0, textValue: 'Оплачены', name: 'capitalAllFrequent', viewMode: 'basic' },
]);

const FilterViewOrientationDemo = React.forwardRef((_, ref) => {
    return (
        <div ref={ref} className="engineDemo__wrapper">
            <FilterView storeId="cities" detailPanelOrientation="horizontal" />
            <ListView storeId="cities" />
        </div>
    );
});

FilterViewOrientationDemo.getLoadConfig = function () {
    return {
        cities: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                filterDescription: [
                    dropdownAllFrequentConfig,
                    lookupConfig,
                    dropdownSingleSelectConfig,
                    lookupInputConfig,
                    dateMenuConfig,
                    inputConfig,
                ],
                source: new Memory({
                    data: [
                        { id: 1, title: 'Yaroslavl' },
                        { id: 2, title: 'Moscow' },
                        { id: 3, title: 'Kazan' },
                    ],
                    keyProperty: 'id',
                    filter,
                }),
                keyProperty: 'id',
                viewMode: 'list',
                displayProperty: 'title',
                historyId: 'ORIENTATION_HISTORY_ID_DEMO',
            },
        },
    };
};

export default FilterViewOrientationDemo;

const dropdownAllFrequentConfig = {
    name: 'capitalAllFrequent',
    value: null,
    resetValue: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'extended',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                { id: 0, title: 'Оплачены' },
                { id: 1, title: 'Не оплачены' },
                { id: 2, title: 'Частично оплачены' },
            ],
            keyProperty: 'id',
        }),
        frequentItems: [
            {
                id: 0,
                title: 'Оплачены',
            },
            {
                id: 1,
                title: 'Нет',
            },
            {
                id: 2,
                title: 'Частично',
            },
        ],
        extendedCaption: 'Оплата',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

const lookupConfig = {
    name: 'cities',
    editorTemplateName: 'Controls/filterPanelEditors:Lookup',
    resetValue: [],
    value: [],
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data: cities,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Город',
        selectorTemplate: {
            multiSelect: true,
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: cities,
            },
        },
        multiSelect: true,
    },
} as IFilterItem;

const dropdownSingleSelectConfig = {
    caption: 'Страна',
    name: 'country',
    value: null,
    resetValue: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'basic',
    editorOptions: {
        source: new Memory({
            data: [
                { id: null, title: 'Все страны' },
                { id: 'USA', title: 'США' },
                { id: 'Russia', title: 'Россия' },
                { id: 'Italy', title: 'Италия' },
            ],
            keyProperty: 'id',
        }),
        navigation: {
            source: 'page',
            view: 'pages',
            sourceConfig: {
                pageSize: 4,
                page: 0,
                hasMore: false,
            },
        },
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

const data = [
    { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
    { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
    { id: 'Субботин А.В.', title: 'Субботин А.В.' },
];

const lookupInputConfig = {
    name: 'owner',
    caption: 'Руководитель',
    editorTemplateName: 'Controls/filterPanelEditors:LookupInput',
    resetValue: [],
    value: [],
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data,
            filter: dataFilter,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        searchParam: 'title',
        selectorTemplate: {
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: data,
            },
        },
        suggestTemplate: {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
        },
        multiSelect: true,
        extendedCaption: 'Выбор руководителя из поля выбора из справочника',
    },
} as IFilterItem;

const dateMenuConfig = {
    caption: 'Дата оформления',
    name: 'dateEditorFrom',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        excludedPeriods: ['yesterday', 'week', 'quarter'],
        extendedCaption: 'Дата оформления',
    },
} as IFilterItem;

const inputConfig = {
    name: 'departmentInput',
    caption: 'Отдел',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:InputEditor',
    resetValue: '',
    value: '',
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        extendedCaption: 'Поле ввода отделов',
    },
} as IFilterItem;
