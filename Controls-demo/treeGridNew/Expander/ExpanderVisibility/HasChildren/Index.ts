import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Expander/ExpanderVisibility/HasChildren/HasChildren';
import { CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Gadgets } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Gadgets';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

const { getData } = Gadgets;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];
    protected _expandedItems: CrudEntityKey[] = [null];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    hasChildrenProperty: 'hasChild',
                    expandedItems: [null],
                },
            },
        };
    }
}
