import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemTemplate/WithPhoto/TwoLevelsWithoutPhoto/TwoLevelsWithoutPhoto';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return WithPhoto.getDataTwoLvl();
}

export default class extends Control<IControlOptions> {
    static _styles: string[] = ['Controls-demo/treeGridNew/ItemTemplate/WithPhoto/styles'];
    protected _template: TemplateFunction = Template;
    protected _twoLvlColumnsNoPhoto: IColumn[] = WithPhoto.getGridTwoLevelColumnsWithPhoto().map(
        (cur) => {
            return {
                ...cur,
                template: undefined,
            };
        }
    );

    static getLoadConfig(
        expandOnLoad?: boolean
    ): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateWithPhotoTwoLevelsWithoutPhoto5: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'Раздел',
                    }),
                    expandedItems: expandOnLoad === false ? [] : [1, 2, 4],
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                },
            },
        };
    }
}
