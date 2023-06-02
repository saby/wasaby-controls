import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemTemplate/WithPhoto/TwoLevelsWithoutPhoto/TwoLevelsWithoutPhoto';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    // eslint-disable-next-line
    protected _expandedItems: CrudEntityKey[] = [1, 2, 4];
    protected _twoLvlColumnsNoPhoto: IColumn[] =
        WithPhoto.getGridTwoLevelColumnsWithPhoto().map((cur) => {
            return {
                ...cur,
                template: undefined,
            };
        });

    protected _beforeMount(options: IControlOptions): void {
        if (options.hasOwnProperty('collapseNodes')) {
            this._expandedItems = [];
        }
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: WithPhoto.getDataTwoLvl(),
            parentProperty: 'parent',
        });
    }

    static _styles: string[] = [
        'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/styles',
    ];
}
