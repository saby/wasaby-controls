import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/DateMenuEditor/Index';
import { dateMenuWithFrequentItemConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Index';
import { Memory } from 'Types/source';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const data = departments.map((depart) => {
    return {
        ...depart,
        date: new Date(2018, 0, 29),
    };
});

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            dateMenuData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data,
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'department',
                    root: null,
                    filterDescription: [
                        {
                            ...dateMenuWithFrequentItemConfig,
                            editorOptions: {
                                ...dateMenuWithFrequentItemConfig.editorOptions,
                                itemTemplate: null,
                            },
                        },
                    ],
                },
            },
        };
    }
}
