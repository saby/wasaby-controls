import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Frequent/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            dateMenuData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            {
                                id: 'Новиков Д.В.',
                                title: 'Новиков Д.В.',
                                date: new Date(2022, 0, 7),
                            },
                            {
                                id: 'Кошелев А.Е.',
                                title: 'Кошелев А.Е.',
                                date: new Date(2022, 10, 1),
                            },
                            {
                                id: 'Субботин А.В.',
                                title: 'Субботин А.В.',
                                date: new Date(2022, 6, 14),
                            },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            caption: 'Период',
                            name: 'dateRange',
                            editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
                            viewMode: 'frequent',
                            textValue: 'Весь период',
                            value: null,
                            emptyText: 'Весь период',
                            type: 'dateMenu',
                            editorOptions: {
                                closeButtonVisibility: 'hidden',
                                dateMenuItems: new RecordSet({
                                    rawData: [
                                        { id: 'Today', title: 'Сегодня' },
                                        { id: 'Week', title: 'На этой неделе' },
                                        { id: 'Month', title: 'В этом месяце' },
                                        {
                                            id: 'Overdue',
                                            title: 'Просроченные',
                                            frequent: true,
                                        },
                                    ],
                                    keyProperty: 'id',
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                        },
                        {
                            name: 'response',
                            value: null,
                            resetValue: null,
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        {
                                            id: 'Новиков Д.В.',
                                            title: 'Новиков Д.В.',
                                        },
                                        {
                                            id: 'Кошелев А.Е.',
                                            title: 'Кошелев А.Е.',
                                        },
                                        {
                                            id: 'Субботин А.В.',
                                            title: 'Субботин А.В.',
                                        },
                                    ],
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                            viewMode: 'frequent',
                        },
                        {
                            name: 'department',
                            value: null,
                            resetValue: null,
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        {
                                            id: 'Разработка',
                                            title: 'Разработка',
                                        },
                                        {
                                            id: 'Бухгалтерия',
                                            title: 'Бухгалтерия',
                                        },
                                    ],
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                            },
                            viewMode: 'frequent',
                        },
                    ],
                },
            },
        };
    }
}
