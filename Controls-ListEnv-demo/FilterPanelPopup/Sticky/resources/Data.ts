import { IFilterItem } from 'Controls/filter';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { object } from 'Types/util';
import HistoryMemory from 'Controls-ListEnv-demo/FilterPanelPopup/Sticky/resources/HistoryMemory';

export const textConfig = {
    name: 'isDevelopment',
    editorTemplateName: 'Controls/filterPanel:TextEditor',
    resetValue: false,
    textValue: '',
    viewMode: 'extended',
    value: false,
    editorOptions: {
        filterValue: true,
        extendedCaption: 'Разработка',
    },
} as IFilterItem;

export const inputConfig = {
    name: 'departmentInput',
    caption: 'Отдел',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:InputEditor',
    resetValue: '',
    value: 'Отдел',
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        extendedCaption: 'Поле ввода отделов',
    },
} as IFilterItem;

export const textBasicConfig = {
    ...textConfig,
    ...{ value: true, viewMode: 'basic' },
} as IFilterItem;

export const textConfigOwner = {
    name: 'isOwner',
    editorTemplateName: 'Controls/filterPanel:TextEditor',
    resetValue: false,
    textValue: '',
    viewMode: 'extended',
    value: false,
    editorOptions: {
        filterValue: true,
        extendedCaption: 'Наша компания',
    },
} as IFilterItem;

export const textConfigWithLongCaption = {
    name: 'isDevelopmentLong',
    editorTemplateName: 'Controls/filterPanel:TextEditor',
    resetValue: false,
    textValue: '',
    viewMode: 'extended',
    value: false,
    editorOptions: {
        filterValue: true,
        extendedCaption: 'Логический редактор с очень длинным названием',
    },
} as IFilterItem;

export const radioGroupConfig = {
    name: 'radioGender',
    caption: 'Пол',
    value: '1',
    resetValue: '1',
    textValue: '',
    viewMode: 'basic',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:RadioGroupEditor',
    editorOptions: {
        items: new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Мужской',
                },
                {
                    id: '2',
                    title: 'Женский',
                },
            ],
        }),
        keyProperty: 'id',
        displayProperty: 'title',
    },
} as IFilterItem;

export const numberRangeConfig = {
    caption: 'Зар. плата',
    name: 'salary',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:NumberRangeEditor',
    resetValue: [],
    value: [],
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        extendedCaption: 'Зар. плата',
        integersLength: 3,
    },
} as IFilterItem;

export const numberRangeBasicConfig = {
    ...numberRangeConfig,
    ...{ value: [1, 3], viewMode: 'basic' },
} as IFilterItem;

export const dropdownMultiSelectConfig = {
    caption: 'Страны',
    name: 'country',
    value: [],
    resetValue: [],
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:DropdownEditor',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            data: [
                { id: 'USA', title: 'США' },
                { id: 'Russia', title: 'Россия' },
                { id: 'Italy', title: 'Италия' },
                { id: 'United Kingdom', title: 'Великобритания' },
            ],
            keyProperty: 'id',
        }),
        multiSelect: true,
        extendedCaption: 'Страны',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

export const dropdownFrequentItemConfig = {
    caption: 'Страны',
    name: 'countries',
    value: [],
    resetValue: [],
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:DropdownEditor',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            data: [
                { id: 'USA', title: 'США' },
                { id: 'Russia', title: 'Россия' },
                { id: 'Italy', title: 'Италия' },
                { id: 'United Kingdom', title: 'Великобритания' },
            ],
            keyProperty: 'id',
        }),
        multiSelect: true,
        frequentItemText: 'Россия',
        frequentItemKey: 'Russia',
        extendedCaption: 'Страны',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

export const dropdownMultiSelectBasicConfig = {
    ...dropdownMultiSelectConfig,
    ...{ value: ['USA', 'Russia'], viewMode: 'basic' },
} as IFilterItem;

const dateMenuItems = new RecordSet({
    rawData: [
        { id: 'Today', title: 'Сегодня', value: [new Date(2022, 0, 7)] },
        {
            id: 'Year',
            title: 'В этом году',
            value: [new Date(2022, 0, 1), new Date(2022, 0, 7)],
        },
        {
            id: 'LastYear',
            title: 'В прошлом году',
            value: [new Date(2021, 0, 1), new Date(2021, 0, 30)],
        },
    ],
    keyProperty: 'id',
});

export const dateMenuConfig = {
    caption: 'Дата оформления',
    name: 'dateEditorFrom',
    editorTemplateName: 'Controls/filterPanel:DateMenuEditor',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        items: dateMenuItems,
        extendedCaption: 'Дата оформления',
    },
} as IFilterItem;

export const dateMenuBasicConfig = {
    ...dateMenuConfig,
    ...{ value: 'Today', viewMode: 'basic' },
} as IFilterItem;

export const dateConfig = {
    caption: 'Дата',
    name: 'dateEditor',
    editorTemplateName: 'Controls/filterPanel:DateEditor',
    resetValue: null,
    viewMode: 'extended',
    value: null,
    textValue: '',
    editorOptions: {
        closeButtonVisibility: 'hidden',
        extendedCaption: 'Дата',
    },
} as IFilterItem;

export const dateBasicConfig = {
    ...dateConfig,
    ...{ value: new Date(2023, 0, 1), viewMode: 'basic' },
} as IFilterItem;

export const dateRangeConfig = {
    caption: 'Период',
    name: 'dateRangeEditor',
    editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
    resetValue: [],
    viewMode: 'extended',
    value: [],
    textValue: '',
    editorOptions: {
        extendedCaption: 'Период',
    },
} as IFilterItem;

export const dateRangeBasicConfig = {
    ...dateRangeConfig,
    ...{ value: [new Date(2023, 0, 1)], viewMode: 'basic' },
} as IFilterItem;

export const departments = [
    {
        id: 1,
        department: 'Разработка',
        title: 'Разработка',
        isDevelopment: true,
        salary: 100,
        amount: '999+',
    },
    {
        id: 2,
        department: 'Продвижение СБИС',
        title: 'Продвижение СБИС',
        isDevelopment: false,
        salary: 200,
        amount: 30,
    },
    {
        id: 3,
        department: 'Федеральная клиентская служба',
        isDevelopment: false,
        salary: 300,
        amount: '999+',
        title: 'Федеральная клиентская служба с очень длинным многострочным названием',
    },
];

export const dropdownConfig = {
    caption: 'Отдел',
    name: 'department',
    value: null,
    resetValue: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:DropdownEditor',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            data: departments,
            keyProperty: 'id',
        }),
        extendedCaption: 'Отдел',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

export const dropdownAllFrequentConfig = {
    name: 'capitalAllFrequent',
    value: null,
    resetValue: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:DropdownEditor',
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
        frequentItemKey: [1, 2, 3],
        extendedCaption: 'Оплата',
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

export const dropdownBasicConfig = {
    ...dropdownConfig,
    ...{ value: 3, viewMode: 'basic' },
} as IFilterItem;

export const cities = [
    {
        id: 'Yaroslavl',
        title: 'Yaroslavl city with very very very very very very long title',
    },
    { id: 'Moscow', title: 'Moscow' },
    { id: 'Kazan', title: 'Kazan' },
    { id: 'Rostov', title: 'Rostov' },
    { id: 'Saint Petersburg', title: 'Saint Petersburg' },
    { id: 'Anapa', title: 'Anapa' },
    { id: 'Belgorod', title: 'Belgorod' },
    { id: 'Veliky Novgorod', title: 'Veliky Novgorod' },
];

export const multiSelectLookupConfig = {
    name: 'city',
    editorTemplateName: 'Controls/filterPanel:LookupEditor',
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

export const multiSelectLookupBasicConfig = {
    ...multiSelectLookupConfig,
    ...{
        value: ['Yaroslavl', 'Moscow', 'Anapa', 'Belgorod', 'Saint Petersburg', 'Veliky Novgorod'],
        viewMode: 'basic',
    },
} as IFilterItem;

export const inputLookupConfig = {
    name: 'inputLookupConfig',
    caption: 'Город',
    editorTemplateName: 'Controls/filterPanel:LookupEditor',
    resetValue: null,
    value: 'Yaroslavl',
    textValue: '',
    viewMode: 'basic',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data: cities,
        }),
        searchParam: 'title',
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Единичный город lookupInput',
        selectorTemplate: {
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: cities,
            },
        },
        suggestTemplate: {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
        },
    },
} as IFilterItem;

export const lookupConfig = {
    name: 'lookupCity',
    caption: 'Город',
    editorTemplateName: 'Controls/filterPanel:LookupEditor',
    resetValue: null,
    value: null,
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data: cities,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Единичный город',
        selectorTemplate: {
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: cities,
            },
        },
    },
} as IFilterItem;

export const lookupBasicConfig = {
    ...lookupConfig,
    ...{ value: 'Yaroslavl', viewMode: 'basic' },
} as IFilterItem;

const companyEditorData = [
    {
        id: 'Samsung',
        title: 'Very very long caption for Samsung',
        counter: 1,
        addText: '1',
    },
    { id: 'Apple', title: 'Apple', counter: 2, addText: '1' },
    { id: 'Xiaomi', title: 'Xiaomi', counter: 1, addText: '2' },
    { id: 'Huawei', title: 'Huawei', counter: 3, addText: '3' },
];

const companyEditor = {
    name: 'company',
    caption: 'Компания',
    value: 'Samsung',
    resetValue: null,
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    textValue: '',
    viewMode: 'basic',
    expanderVisible: true,
    editorOptions: {
        historyId: 'Sticky__HistoryId',
        source: new HistoryMemory({
            data: companyEditorData,
            keyProperty: 'id',
        }),
        items: new RecordSet({
            rawData: companyEditorData,
            keyProperty: 'id',
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Компания',
        selectorTemplate: {
            templateName:
                'Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate',
            templateOptions: {
                items: companyEditorData,
            },
        },
    },
} as IFilterItem;
const extendedCompanyEditor = object.clone(companyEditor);
extendedCompanyEditor.name = 'extendedCompany';
extendedCompanyEditor.value = null;
extendedCompanyEditor.viewMode = 'extended';

const emptyCompanyEditor = object.clone(companyEditor);
emptyCompanyEditor.name = 'emptyCompany';
emptyCompanyEditor.viewMode = 'basic';

const companyEditorWithoutExpander = object.clone(emptyCompanyEditor);
companyEditorWithoutExpander.name = 'companyWithoutExpander';
companyEditorWithoutExpander.expanderVisible = false;
companyEditorWithoutExpander.editorOptions.editArrowClickCallback = () => {};
companyEditorWithoutExpander.editorOptions.historyId = undefined;
companyEditorWithoutExpander.editorOptions.showEditArrow = true;

const multiSelectCompanyEditor = object.clone(emptyCompanyEditor);
multiSelectCompanyEditor.name = 'multiSelectCompany';
multiSelectCompanyEditor.groupTextAlign = 'right';
multiSelectCompanyEditor.value = ['Samsung'];
multiSelectCompanyEditor.resetValue = [];
multiSelectCompanyEditor.editorOptions.multiSelect = true;

const companyEditorWithoutCaption = object.clone(emptyCompanyEditor);
companyEditorWithoutCaption.name = 'companyWithoutCaption';
companyEditorWithoutCaption.caption = '';

const companyEditorWithCount = object.clone(companyEditor);
companyEditorWithCount.name = 'companyWithCount';
companyEditorWithCount.value = companyEditorWithCount.resetValue;
companyEditorWithCount.editorOptions.additionalTextProperty = 'addText';

export {
    extendedCompanyEditor,
    emptyCompanyEditor,
    companyEditor,
    multiSelectCompanyEditor,
    companyEditorWithoutExpander,
    companyEditorWithoutCaption,
    companyEditorWithCount,
};

export const typeEditorData = [
    { id: 'Ноутбуки', title: 'Ноутбуки' },
    { id: 'ПК', title: 'ПК' },
    { id: 'Телевизоры', title: 'Телевизоры' },
    { id: 'Смартфоны', title: 'Смартфоны' },
];

export const typeEditor = {
    name: 'type',
    caption: 'Тип',
    value: null,
    resetValue: null,
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    textValue: '',
    viewMode: 'extended',
    expanderVisible: true,
    editorOptions: {
        source: new Memory({
            data: typeEditorData,
            keyProperty: 'id',
        }),
        items: new RecordSet({
            rawData: typeEditorData,
            keyProperty: 'id',
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        markerStyle: 'primary',
        extendedCaption: 'Тип',
        selectorTemplate: {
            templateName:
                'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
            templateOptions: {
                items: typeEditorData,
            },
        },
    },
} as IFilterItem;

export const tumblerConfig = {
    name: 'gender',
    value: '1',
    resetValue: null,
    viewMode: 'basic',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:TumblerEditor',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Мужской',
                },
                {
                    id: '2',
                    caption: 'Женский',
                },
            ],
            keyProperty: 'id',
            displayProperty: 'caption',
        }),
        extendedCaption: 'Пол',
    },
} as IFilterItem;
