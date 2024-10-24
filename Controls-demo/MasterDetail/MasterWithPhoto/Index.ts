import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/MasterDetail/MasterWithPhoto/MasterWithPhoto';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = WithPhoto.getGridColumnsWithPhoto().slice(0, 1);

    static _styles: string[] = ['Controls-demo/treeGridNew/ItemTemplate/WithPhoto/styles'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            master: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
