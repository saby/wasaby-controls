import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentWidth/DifferentWidth';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    const data = Gadgets.getData();
    data.push({
        ...data[2],
        title: 'Конфеты копия 2',
        id: 4,
        width: '30%',
    });
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            DifferentWidth: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
