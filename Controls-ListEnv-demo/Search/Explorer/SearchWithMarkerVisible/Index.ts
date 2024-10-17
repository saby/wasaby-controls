import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { HierarchyData } from '../Data';
import HierarchyMemory from '../HierarchyMemory';

import * as template from 'wml!Controls-ListEnv-demo/Search/Explorer/SearchWithMarkerVisible/Index';

import 'css!Controls-ListEnv-demo/Search/Index';

/**
 * Демка для тестирования поиска в колонке мастера с explorer при включенном markerVisibility=visible
 */
class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];

    static _styles: string[] = ['DemoStand/Controls-demo', 'Controls-demo/MasterDetail/Demo'];
}

export default Object.assign(Demo, {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Basemaster: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchyMemory({
                        keyProperty: 'id',
                        data: HierarchyData.filter((item, index) => {
                            return item.node;
                        }).map((item) => {
                            return {
                                ...item,
                                node: null,
                            };
                        }),
                    }),
                    markerVisibility: 'visible',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    keyProperty: 'id',
                    searchStartingWith: 'root',
                    searchParam: 'title',
                },
            },
            Basedetail: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchyMemory({
                        keyProperty: 'id',
                        data: HierarchyData,
                    }),
                    markerVisibility: 'visible',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    keyProperty: 'id',
                    searchStartingWith: 'root',
                    multiSelectVisibility: 'visible',
                    searchParam: 'title',
                    viewMode: 'table',
                },
            },
        };
    },
});
