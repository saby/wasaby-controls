import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/EditorsViewMode/Default/Index';
import { Memory } from 'Types/source';
import { tumblerConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TumblerEditor/Index';
import { lookupConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/MultiSelect/Index';
import { listWithPhoto } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/WithPhoto/Index';
import { IColumn, IHeaderCell } from 'Controls/grid';
import * as filter from 'Controls-ListEnv-demo/FilterPanel/View/EditorsViewMode/Default/DataFilter';
import { sourceData, owners } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const listWithPhotoConfig = { ...listWithPhoto };
listWithPhotoConfig.editorOptions.markerStyle = 'default';

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
        {
            displayProperty: 'date',
        },
    ];
    protected _header: IHeaderCell[] = [
        { caption: 'Отдел' },
        { caption: 'Руководитель' },
        { caption: 'Город' },
        { caption: 'Дата' },
    ];
    static getLoadConfig(): unknown {
        return {
            scrollFilters: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'department',
                        filter,
                    }),
                    displayProperty: 'title',
                    keyProperty: 'department',
                    filterDescription: [
                        {
                            name: 'owner',
                            caption: 'Руководитель',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            resetValue: [],
                            value: [],
                            textValue: '',
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: owners,
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                                multiSelect: true,
                            },
                        },
                        listWithPhotoConfig,
                        lookupConfig,
                        tumblerConfig,
                    ],
                },
            },
        };
    }
}
