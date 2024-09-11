import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/SearchWithLadderPhoto/SearchWithLadderPhoto';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IRemovableList } from 'Controls/list';
import { IColumn } from 'Controls/grid';
import { TRoot } from 'Controls-demo/types';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Gadgets.getSearchColumnsWithLadderPhoto();
    protected _root: TRoot = null;
    protected _searchStartingWith: string = 'root';
    protected _ladderProperties: string[] = ['image'];

    protected _itemActions: IItemAction[] = [
        {
            id: 0,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete pls',
            showType: 0,
            handler: (item) => {
                (this._children.view as IRemovableList)
                    .removeItemsWithConfirmation({
                        selected: [item.getKey()],
                        excluded: [],
                    })
                    .then(() => {
                        this._children.view.reload();
                    });
            },
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getSearchData(),
            filter: () => {
                return true;
            },
        });
    }

    static _styles: string[] = ['Controls-demo/explorerNew/SearchWithLadderPhoto/styles'];
}
