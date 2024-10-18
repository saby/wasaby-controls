import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Basic/Index';
import { Memory } from 'Types/source';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { dateBasicConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DateEditor/Index';
import { dateRangeBasicConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DateRangeEditor/Index';
import { dropdownBasicConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index';
import { textBasicConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TextEditor/Index';
import { tumblerBasicConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TumblerEditor/Index';
import { lookupBasicConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/MultiSelect/Index';
import { radioGroupConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/RadioGroupEditor/Index';
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
            basicData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'department',
                        filter,
                    }),
                    root: null,
                    historyId: 'Basic__HistoryId',
                    keyProperty: 'department',
                    displayProperty: 'title',
                    filterDescription: [
                        dateBasicConfig,
                        dateRangeBasicConfig,
                        dropdownBasicConfig,
                        textBasicConfig,
                        tumblerBasicConfig,
                        lookupBasicConfig,
                        radioGroupConfig,
                        {
                            caption:
                                'Very very very very very very very very very very very long caption',
                            name: 'cityDropdown',
                            value: 'Yaroslavl',
                            resetValue: null,
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
                            viewMode: 'basic',
                            editorOptions: {
                                source: new Memory({
                                    data: [
                                        {
                                            id: 'Yaroslavl',
                                            title: 'Very very very Very very very very very long title of Yaroslavl',
                                        },
                                        { id: 'Moscow', title: 'Moscow' },
                                        { id: 'Kazan', title: 'Kazan' },
                                    ],
                                    keyProperty: 'id',
                                }),
                                extendedCaption: 'Меню городов',
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
