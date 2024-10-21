import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo40px/Photo40px';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control<IControlOptions> {
    static _styles: string[] = ['Controls-demo/treeGridNew/ItemTemplate/WithPhoto/styles'];
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = WithPhoto.getGridColumnsWithPhoto();

    // argument for common demo
    static getLoadConfig(
        expandOnLoad?: boolean
    ): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateWithPhotoPhoto40px4: {
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
                    expandedItems: expandOnLoad === false ? [] : [1, 15, 153],
                },
            },
        };
    }
}
