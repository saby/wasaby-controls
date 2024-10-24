import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/DropdownEditor/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import * as dataFilter from './DataFilter';
import 'Controls-ListEnv-demo/Filter/View/resources/HistorySourceDemo';

const data = [
    { id: 1, title: 'Ярославль', country: 'Russia' },
    { id: 2, title: 'Москва', country: 'Russia' },
    { id: 3, title: 'Вашингтон', country: 'USA' },
    { id: 4, title: 'Ростов', country: 'Russia' },
    { id: 5, title: 'Рим', country: 'Italy' },
];

export const dropdownConfig = {
    caption: 'Столицы',
    name: 'capital',
    value: null,
    resetValue: null,
    textValue: '',
    emptyText: 'Все',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            data: [
                { id: 1, title: 'Ярославль', isCapital: false },
                { id: 2, title: 'Москва', isCapital: true },
                { id: 3, title: 'Вашингтон', isCapital: true },
                { id: 4, title: 'Ростов', isCapital: false },
                { id: 5, title: 'Рим', isCapital: true },
            ],
            keyProperty: 'id',
        }),
        filter: { isCapital: true },
        extendedCaption: 'Столицы',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

const dropdownSingleSelectConfig = {
    caption: 'Страна',
    name: 'singleCountry',
    value: 'USA',
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

const countryItems = [
    { id: 'USA', title: 'США' },
    { id: 'Russia', title: 'Россия' },
    { id: 'Italy', title: 'Италия' },
    { id: 'France', title: 'Франция' },
    { id: 'Great Britain', title: 'Великобритания' },
    { id: 'Spain', title: 'Испания' },
    { id: 'Norway', title: 'Норвегия' },
];
const dropdownMultiSelectConfig = {
    caption: 'Страны',
    name: 'country',
    value: [],
    resetValue: [],
    textValue: '',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            data: [
                { id: 'USA', title: 'США' },
                { id: 'Russia', title: 'Россия' },
                { id: 'Italy', title: 'Италия' },
            ],
            keyProperty: 'id',
        }),
        multiSelect: true,
        extendedCaption: 'Страны',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

const dropdownSelectorStackConfig = {
    caption: 'Страны со справочником',
    name: 'countrySelector',
    value: [],
    resetValue: [],
    textValue: '',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            data: countryItems,
            keyProperty: 'id',
        }),
        navigation: {
            source: 'page',
            view: 'pages',
            sourceConfig: {
                pageSize: 3,
                page: 0,
                hasMore: false,
            },
        },
        selectorTemplate: {
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: countryItems,
            },
        },
        extendedCaption: 'Страны со справочником',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

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

const dropdownCityFrequentConfig = {
    name: 'cityFrequent',
    value: null,
    resetValue: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'extended',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                { id: 0, title: 'Москва' },
                { id: 1, title: 'Санкт-Петербург' },
                { id: 2, title: 'Ярославль' },
            ],
            keyProperty: 'id',
        }),
        frequentItemKey: 2,
        extendedCaption: 'Город',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

const dropdownFrequentConfig = {
    name: 'capitalFrequent',
    value: null,
    resetValue: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'extended',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                { id: 1, title: 'Оплачены' },
                { id: 2, title: 'Нет' },
                { id: 3, title: 'Частично' },
            ],
            keyProperty: 'id',
        }),
        frequentItemKey: 3,
        extendedCaption: 'Оплата',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig(): unknown {
        return {
            city: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [
                        dropdownSingleSelectConfig,
                        dropdownAllFrequentConfig,
                        dropdownCityFrequentConfig,
                        dropdownFrequentConfig,
                        dropdownConfig,
                        dropdownMultiSelectConfig,
                        dropdownSelectorStackConfig,
                    ],
                    historyId: 'DropdownEditor_HistoryId',
                    keyProperty: 'id',
                    displayProperty: 'title',
                    source: new Memory({
                        data,
                        keyProperty: 'id',
                        filter: dataFilter,
                    }),
                },
            },
        };
    }
}
