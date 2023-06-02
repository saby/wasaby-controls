import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/InMaster/Index';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { listWithPhoto } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/WithPhoto/Index';
import { tumblerConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TumblerEditor/Index';
import * as filter from './DataFilter';
import {
    sourceData,
    owners,
} from 'Controls-ListEnv-demo/Filter/resources/DataStorage';

const listWithPhotoConfig = {
    ...listWithPhoto,
    ...{
        caption: null,
        emptyText: 'Все',
        emptyKey: 'Все',
    },
};

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
                        listWithPhotoConfig,
                        {
                            name: 'owner',
                            caption: 'Руководитель',
                            editorTemplateName:
                                'Controls/filterPanel:ListEditor',
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
                        tumblerConfig,
                    ],
                },
            },
        };
    }
}
