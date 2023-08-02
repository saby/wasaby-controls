import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemTemplate/WithPhoto/TwoLevelsWithoutPhoto/TwoLevelsWithoutPhoto';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return WithPhoto.getDataTwoLvl();
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    // eslint-disable-next-line
    protected _expandedItems: CrudEntityKey[] = [1, 2, 4];
    protected _twoLvlColumnsNoPhoto: IColumn[] = WithPhoto.getGridTwoLevelColumnsWithPhoto().map(
        (cur) => {
            return {
                ...cur,
                template: undefined,
            };
        }
    );

    protected _beforeMount(options: IControlOptions): void {
        if (options.hasOwnProperty('collapseNodes')) {
            this._expandedItems = [];
        }
    }

    static _styles: string[] = ['Controls-demo/treeGridNew/ItemTemplate/WithPhoto/styles'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData5: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    expandedItems: [1, 2, 4],
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                },
            },
        };
    }
}
