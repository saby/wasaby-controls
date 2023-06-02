import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/Index';
import { Memory } from 'Types/source';
import {
    departments,
    sourceData,
} from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';
import { IColumn, IHeaderCell } from 'Controls/grid';
import * as filter from './DataFilter';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';

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
            displayProperty: 'city',
        },
    ];
    protected _header: IHeaderCell[] = [
        { caption: 'Отдел' },
        { caption: 'Руководитель' },
        { caption: 'Город' },
    ];

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
        return {
            basicData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'department',
                    displayProperty: 'title',
                    root: null,
                    filterDescription: [
                        {
                            name: 'department',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            emptyKey: null,
                            emptyText: 'Все',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                keyProperty: 'department',
                                displayProperty: 'title',
                                source: new Memory({
                                    data: departments,
                                    keyProperty: 'department',
                                }),
                                markerStyle: 'primary',
                            },
                        },
                        {
                            caption: 'Город',
                            name: 'city',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                keyProperty: 'city',
                                displayProperty: 'city',
                                source: new Memory({
                                    data: sourceData,
                                    keyProperty: 'city',
                                }),
                            },
                        },
                        {
                            caption: '',
                            name: 'owner',
                            resetValue: [],
                            value: [],
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                multiSelect: true,
                                keyProperty: 'owner',
                                displayProperty: 'owner',
                                source: new Memory({
                                    data: sourceData,
                                    keyProperty: 'owner',
                                }),
                            },
                        },
                    ],
                },
            },
        };
    }
}
