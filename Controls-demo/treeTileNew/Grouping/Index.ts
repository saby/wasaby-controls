import { HierarchicalMemory } from 'Types/source';
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/treeTileNew/Grouping/Index';
import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Gadgets;

/**
 * Демка для автотеста по группировке в плитке
 */
export default class extends Control {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    nodeProperty: 'parent@',
                    parentProperty: 'parent',

                },
            },
        };
    }
}
