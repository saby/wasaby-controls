/* eslint-disable no-magic-numbers */
import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

const headerContentTemplate =
    'wml!Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/headerContentTemplate';

export const dateMenuItems = new RecordSet({
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
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        items: dateMenuItems,
        headerContentTemplate,
        extendedCaption: 'Дата оформления',
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
        items: dateMenuItems,
        headerContentTemplate,
        extendedCaption: 'Дата оформления',
    },
} as IFilterItem;

export const simpleDateMenuConfig = {
    caption: 'Дата доставки',
    name: 'dateEditorTo',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    textValue: '',
    resetValue: null,
    viewMode: 'extended',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        extendedCaption: 'Срок доставки',
        dateMenuItems,
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

export const dateMenuFrequentConfig = {
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
        items: new RecordSet({
            rawData: [
                { id: 'Today', title: 'Сегодня', value: new Date(2018, 0, 7) },
                {
                    id: 'Week',
                    title: 'На этой неделе',
                    value: [new Date(2018, 0, 1), new Date(2018, 0, 7)],
                },
                {
                    id: 'Month',
                    title: 'В этом месяце',
                    comment: "январь'24",
                    value: [new Date(2018, 0, 1), new Date(2018, 0, 30)],
                },
                {
                    id: 'Year',
                    title: 'В этом году',
                    comment: '2024',
                    value: [new Date(2018, 0, 1), new Date(2018, 0, 30)],
                },
                {
                    id: 'Overdue',
                    title: 'Просроченные',
                    value: false,
                    frequent: true,
                },
            ],
            keyProperty: 'id',
        }),
        editorMode: 'Lite',
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Срок',
    },
} as IFilterItem;

const dateMenuWithoutPeriodConfig = {
    caption: 'Без выбора периода',
    name: 'dateEditorWithoutPeriod',
    editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
    resetValue: null,
    viewMode: 'extended',
    textValue: '',
    value: null,
    editorOptions: {
        closeButtonVisibility: 'hidden',
        items: new RecordSet({
            rawData: [
                { id: 'Today', title: 'Сегодня', value: new Date(2018, 0, 7) },
                {
                    id: 'Week',
                    title: 'На этой неделе',
                    value: [new Date(2018, 0, 1), new Date(2018, 0, 7)],
                },
                {
                    id: 'Month',
                    title: 'В этом месяце',
                    value: [new Date(2018, 0, 1), new Date(2018, 0, 30)],
                },
            ],
            keyProperty: 'id',
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        extendedCaption: 'Без выбора периода',
        periodItemVisible: false,
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            dateMenuData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [],
                        keyProperty: 'id',
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        dateMenuConfig,
                        simpleDateMenuConfig,
                        dateMenuFrequentConfig,
                        dateMenuWithoutPeriodConfig,
                    ],
                },
            },
        };
    }
}
