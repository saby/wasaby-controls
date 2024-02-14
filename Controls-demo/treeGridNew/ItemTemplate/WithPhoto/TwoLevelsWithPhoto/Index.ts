import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemTemplate/WithPhoto/TwoLevelsWithPhoto/TwoLevelsWithPhoto';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return WithPhoto.getDataTwoLvl();
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _twoLvlColumns: IColumn[] = WithPhoto.getGridTwoLevelColumnsWithPhoto();

    static _styles: string[] = ['Controls-demo/treeGridNew/ItemTemplate/WithPhoto/styles'];

    static getLoadConfig(
        expandOnLoad?: boolean
    ): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateWithPhotoTwoLevelsWithPhoto6: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'Раздел',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    expandedItems: expandOnLoad === false ? [] : [1, 2, 4],
                },
            },
        };
    }
}
