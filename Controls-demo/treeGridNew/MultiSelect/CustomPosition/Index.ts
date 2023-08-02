import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/MultiSelect/CustomPosition/CustomPosition';
import { HierarchicalMemory } from 'Types/source';
import * as cellTemplate from 'wml!Controls-demo/treeGridNew/MultiSelect/CustomPosition/CellTemplate';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _columns: object[] = [
        { displayProperty: 'title', width: '200px', template: cellTemplate },
        { displayProperty: 'country', width: '200px' },
    ];
    private _selectedKeys: number[] = [];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData6: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: Flat.getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'onhover',
                    selectedKeys: [],
                },
            },
        };
    }
}
