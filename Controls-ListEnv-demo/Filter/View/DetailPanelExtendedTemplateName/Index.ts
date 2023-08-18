import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/DetailPanelExtendedTemplateName/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import * as filter from 'Controls-ListEnv-demo/Filter/View/DetailPanelExtendedTemplateName/DataFilter';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { IColumn, IHeaderCell } from 'Controls/grid';
import 'Controls-ListEnv-demo/Filter/View/resources/HistorySourceDemo';
import 'css!Controls-ListEnv-demo/Filter/View/DetailPanelExtendedTemplateName/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'department',
        },
        {
            displayProperty: 'owner',
        },
        {
            displayProperty: 'salary',
        },
        {
            displayProperty: 'city',
        },
        {
            displayProperty: 'date',
        },
    ];
    protected _header: IHeaderCell[] = [
        { caption: 'Отдел' },
        { caption: 'Руководитель' },
        { caption: 'Зарплата' },
        { caption: 'Город' },
        { caption: 'Дата' },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            DetailPanelExtendedTemplateName: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'department',
                    filterDescription: [
                        {
                            caption: 'Дата',
                            name: 'dateEditor',
                            editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
                            resetValue: null,
                            viewMode: 'extended',
                            value: null,
                            textValue: '',
                            editorOptions: {
                                date: [new Date(2022, 0, 1), new Date(2022, 11, 31)],
                                emptyCaption: 'Весь период',
                                closeButtonVisibility: 'hidden',
                                extendedCaption: '2022',
                            },
                        },
                        {
                            caption: '',
                            name: 'activity',
                            editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                            resetValue: null,
                            viewMode: 'extended',
                            value: null,
                            textValue: '',
                            editorOptions: {
                                items: new RecordSet({
                                    keyProperty: 'key',
                                    rawData: [
                                        {
                                            key: '0',
                                            icon: 'icon-PhoneWork',
                                            iconStyle: 'secondary',
                                            title: 'Звонок',
                                            count: 858,
                                        },
                                        {
                                            icon: 'icon-Mail',
                                            iconStyle: 'info',
                                            key: '1',
                                            title: 'Письмо',
                                            count: 15,
                                        },
                                        {
                                            icon: 'icon-Groups',
                                            iconStyle: 'warning',
                                            key: '2',
                                            title: 'Встреча',
                                            count: 14,
                                        },
                                        {
                                            icon: 'icon-TFComputer',
                                            iconStyle: 'danger',
                                            key: '3',
                                            title: 'Презентация',
                                            count: 5,
                                        },
                                        {
                                            icon: 'icon-Chat',
                                            iconStyle: 'secondary',
                                            key: '4',
                                            title: 'Чат',
                                            count: 2,
                                        },
                                        {
                                            icon: 'icon-statusDrips',
                                            iconStyle: 'secondary',
                                            key: '-1',
                                            title: 'Всего активностей',
                                            count: 894,
                                            fontWeight: 'bold',
                                        },
                                    ],
                                }),
                                contentTemplate: 'Controls/dropdown:defaultContentTemplateWithIcon',
                                keyProperty: 'key',
                                displayProperty: 'title',
                                extendedCaption: 'activity',
                            },
                        },
                    ],
                },
            },
        };
    }
}
