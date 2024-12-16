import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/ChildrenProperty/Base/View';
import { HierarchicalMemory } from 'Types/source';
import { materializedPathData } from 'Controls-demo/tree/data/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return materializedPathData;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        sourceConfig: {
                            page: 0,
                            pageSize: 3,
                            hasMore: false,
                        },
                        view: 'demand',
                    },
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
