import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/BackgroundHoverStyle/BackgroundHoverStyle';
import { HierarchicalMemory } from 'Types/source';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    static _styles: string[] = [
        'Controls-demo/treeGridNew/BackgroundHoverStyle/BackgroundHoverStyle',
    ];
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: unknown[] = [
        {
            displayProperty: 'title',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            BackgroundHoverStyle: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
