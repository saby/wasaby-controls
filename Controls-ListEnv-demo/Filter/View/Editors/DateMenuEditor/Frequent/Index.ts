import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Frequent/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import * as filter from './DataFilter';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
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
                            caption: 'Дата',
                            name: 'date',
                            editorTemplateName: 'Controls/filterPanel:DateMenuEditor',
                            resetValue: null,
                            viewMode: 'frequent',
                            textValue: '',
                            value: null,
                            emptyText: 'Весь период',
                            editorOptions: {
                                closeButtonVisibility: 'hidden',
                                dateMenuItems: new RecordSet({
                                    rawData: [
                                        { id: 'Today', title: 'Сегодня' },
                                        { id: 'Week', title: 'На этой неделе' },
                                        { id: 'Month', title: 'В этом месяце' },
                                    ],
                                    keyProperty: 'id',
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                                extendedCaption: 'Срок',
                                selectionType: 'single',
                            },
                        },
                        {
                            caption: 'Период',
                            name: 'dateRange',
                            editorTemplateName: 'Controls/filterPanel:DateMenuEditor',
                            resetValue: null,
                            viewMode: 'frequent',
                            textValue: '',
                            value: null,
                            emptyText: 'Весь период',
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
                    ],
                },
            },
        };
    }
}
