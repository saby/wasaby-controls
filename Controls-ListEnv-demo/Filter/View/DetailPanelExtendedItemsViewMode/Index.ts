import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/DetailPanelExtendedItemsViewMode/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { dateConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DateEditor/Index';
import { dropdownConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index';
import { textConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TextEditor/Index';
import { tumblerConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TumblerEditor/Index';
import { lookupConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/MultiSelect/Index';
import { IColumn, IHeaderCell } from 'Controls/grid';
import * as filter from './DataFilter';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';
import 'Controls-ListEnv-demo/Filter/View/resources/HistorySourceDemo';
import 'css!Controls-ListEnv-demo/Filter/filter';

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

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
        return {
            filterView: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'department',
                    displayProperty: 'title',
                    historyId: 'myHistoryId',
                    filterDescription: [
                        dateConfig,
                        dropdownConfig,
                        textConfig,
                        tumblerConfig,
                        lookupConfig,
                    ],
                },
            },
        };
    }
}
