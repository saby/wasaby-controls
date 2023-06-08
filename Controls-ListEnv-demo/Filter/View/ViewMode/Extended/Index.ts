import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Extended/Index';
import { Memory } from 'Types/source';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { dateConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DateEditor/Index';
import { dropdownConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index';
import { textConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TextEditor/Index';
import { lookupConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/MultiSelect/Index';
import { lookupInputConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/Index';
import { IColumn, IHeaderCell } from 'Controls/grid';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            extendedData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'department',
                        filter,
                    }),
                    root: null,
                    historyId: 'ViewMode-Extended__HistoryId',
                    keyProperty: 'department',
                    displayProperty: 'title',
                    filterDescription: [
                        dateConfig,
                        dropdownConfig,
                        textConfig,
                        lookupConfig,
                        lookupInputConfig,
                        {
                            caption: 'Дата создания',
                            name: 'createDateEditor',
                            editorTemplateName: 'Controls/filterPanel:DateEditor',
                            resetValue: null,
                            viewMode: 'extended',
                            value: null,
                            textValue: '',
                            editorOptions: {
                                closeButtonVisibility: 'hidden',
                                extendedCaption: 'Дата создания',
                            },
                        },
                        {
                            caption: 'Период создания',
                            name: 'createDateRangeEditor',
                            editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
                            resetValue: [],
                            viewMode: 'extended',
                            value: [],
                            textValue: '',
                            editorOptions: {
                                extendedCaption: 'Период создания',
                            },
                        },
                    ],
                },
            },
        };
    }
}
