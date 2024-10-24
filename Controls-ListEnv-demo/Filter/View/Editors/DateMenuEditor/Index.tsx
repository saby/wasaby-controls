import * as React from 'react';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';

import 'Controls-ListEnv-demo/Filter/View/resources/HistorySourceDemo';

const _currentDate = new Date(2022, 10, 1);
const headerContentTemplate =
    'wml!Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/headerContentTemplate';

export const simpleBasicDateMenuConfig = {
    caption: 'Дата доставки',
    name: 'dateEditorToBasic',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    textValue: '',
    resetValue: null,
    viewMode: 'basic',
    value: null,
    emptyText: 'Весь период',
    editorOptions: {
        closeButtonVisibility: 'hidden',
        selectionType: 'single',
    },
} as IFilterItem;

export const simpleDateMenuBasicConfig = {
    caption: 'Дата доставки',
    name: 'dateEditorToBasic',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    textValue: '',
    resetValue: null,
    viewMode: 'basic',
    value: [new Date(2020, 0, 1), new Date(2022, 0, 1)],
    editorOptions: {
        closeButtonVisibility: 'hidden',
        extendedCaption: 'Срок доставки',
    },
} as IFilterItem;

export const dateMenuConfig = {
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
        headerContentTemplate,
        extendedCaption: 'Дата оформления',
    },
} as IFilterItem;

export const dateMenuSingleConfig = {
    caption: 'Срок доставки',
    name: 'dateEditorFromSingle',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        excludedPeriods: ['yesterday', 'week', 'quarter'],
        extendedCaption: 'Срок доставки',
        selectionType: 'single',
    },
} as IFilterItem;

const dateMenuFrequentConfig = {
    caption: 'Дата оформления',
    name: 'dateEditorFrequentFrom',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'frequent',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
    },
} as IFilterItem;

export const dateMenuBasicConfig = {
    caption: 'Дата оформления',
    name: 'dateEditorFromBasic',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'basic',
    textValue: '',
    value: [new Date(2020, 0, 1), new Date(2022, 0, 1)],
    editorOptions: {
        closeButtonVisibility: 'hidden',
        excludedPeriods: ['yesterday', 'week', 'quarter'],
        headerContentTemplate,
        extendedCaption: 'Дата оформления',
    },
} as IFilterItem;

const dateMenuPeriodTypesLastFrequentConfig = {
    caption: 'Типажи периода',
    name: 'dateMenuPeriodTypesLastFrequent',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        excludedPeriods: ['yesterday', 'quarter'],
        _date: _currentDate, // только для тестов, чтобы замокать текущий день
        periodType: 'last',
        userPeriods: [
            {
                key: 'Overdue',
                title: 'Бессрочно',
                value: false,
                frequent: true,
            },
        ],
        editorMode: 'Lite',
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'За последний период',
    },
} as IFilterItem;

const dateMenuPeriodTypesFrequentConfig = {
    caption: 'Типажи периода',
    name: 'dateMenuPeriodTypesFrequent',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        excludedPeriods: ['yesterday', 'quarter'],
        _date: _currentDate, // только для тестов, чтобы замокать текущий день
        editorMode: 'Lite',
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'За текущий период',
    },
} as IFilterItem;

const dateMenuModeDatesConfig = {
    caption: 'С кастомным пунктом',
    name: 'dateMenuModeDates',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        _date: _currentDate, // только для тестов, чтобы замокать текущий день
        periodType: 'last',
        userPeriods: [
            {
                key: 'twoYears',
                title: 'Два года',
                getValueFunctionName:
                    'Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Index:getValue',
            },
        ],
        selectionType: 'single',
        extendedCaption: 'С кастомным пунктом',
    },
} as IFilterItem;

const dateMenuWithoutPeriodConfig = {
    caption: 'Без выбора периода',
    name: 'dateWithoutCustomPeriodsDates',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        _date: _currentDate, // только для тестов, чтобы замокать текущий день
        periodType: 'last',
        selectionType: 'single',
        extendedCaption: 'Без выбора периода',
        customPeriod: false,
    },
} as IFilterItem;

export const dateMenuWithFrequentItemConfig = {
    caption: 'Срок',
    name: 'dateEditorTerm',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        itemTemplate: 'wml!Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/ItemTpl',
        userPeriods: [
            {
                key: 'Overdue',
                title: 'Просроченные',
                value: false,
                frequent: true,
            },
        ],
        editorMode: 'Lite',
        displayProperty: 'title',
        keyProperty: 'key',
        extendedCaption: 'Срок',
    },
} as IFilterItem;

const DateMenuEditorDemo = React.forwardRef((props, ref) => {
    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <FilterView storeId="dateMenuData" detailPanelWidth="g" />
        </div>
    );
});

DateMenuEditorDemo.getLoadConfig = function () {
    return {
        dateMenuData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
                historyId: 'myHistoryId',
                displayProperty: 'title',
                filterDescription: [
                    simpleBasicDateMenuConfig,
                    dateMenuConfig,
                    dateMenuSingleConfig,
                    dateMenuFrequentConfig,
                    dateMenuWithFrequentItemConfig,
                    dateMenuPeriodTypesLastFrequentConfig,
                    dateMenuPeriodTypesFrequentConfig,
                    dateMenuWithoutPeriodConfig,
                    dateMenuModeDatesConfig,
                ],
            },
        },
    };
};

export default DateMenuEditorDemo;

export function getValue(): [Date, Date] {
    return [new Date(2020, 10, 1), _currentDate];
}
