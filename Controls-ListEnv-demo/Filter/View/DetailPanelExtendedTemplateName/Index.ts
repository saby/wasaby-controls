import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/DetailPanelExtendedTemplateName/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { IColumn, IHeaderCell } from 'Controls/grid';
import 'Controls-ListEnv-demo/Filter/View/resources/HistorySourceDemo';
import 'css!Controls-ListEnv-demo/Filter/filter';

interface IFilter {
    city?: string;
    department?: string;
    gender?: string;
    radioGender?: string;
    isDevelopment?: boolean;
    dateEditor?: Date;
    owner?: string[];
}

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = null;
    protected _filterSource: IFilterItem[] = null;
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

    protected _beforeMount(): void | Promise<void> {
        this._viewSource = new Memory({
            data: sourceData,
            keyProperty: 'department',
            filter: (item, queryFilter: IFilter) => {
                return true;
            },
        });
        this._filterSource = [
            {
                caption: 'Дата',
                name: 'dateEditor',
                editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
                resetValue: null,
                viewMode: 'extended',
                value: null,
                textValue: '',
                editorOptions: {
                    date: new Date(2022, 0, 0),
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
                    source: new Memory({
                        keyProperty: 'key',
                        data: [
                            {
                                key: '1',
                                title: 'Письмо',
                                count: 15
                            },
                            {
                                key: '2',
                                title: 'Встреча',
                                count: 14
                            },
                            {
                                key: '3',
                                title: 'Презентация',
                                count: 5
                            }
                        ]
                    }),
                    keyProperty: 'key',
                    displayProperty: 'title',
                    extendedCaption: 'activity'
                },
            },
        ];
    }
}
