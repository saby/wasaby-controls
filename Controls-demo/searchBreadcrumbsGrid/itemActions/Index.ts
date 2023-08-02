import { Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { Control, TemplateFunction } from 'UI/Base';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/searchBreadcrumbsGrid/itemActions/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[] = [
        {
            caption: 'Наименование',
        },
        {
            caption: 'Код',
        },
        {
            caption: 'Цена',
        },
    ];
    protected _columns: IColumn[] = Gadgets.getSearchColumns();

    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            title: 'Для крошек',
            showType: TItemActionShowType.TOOLBAR,
        },
        {
            id: 2,
            title: 'Для листьев',
            showType: TItemActionShowType.TOOLBAR,
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: Gadgets.getSearchData(true),
        });

        this._columns = Gadgets.getSearchColumns();
    }

    protected _itemActionVisibilityCallback(itemAction: IItemAction, item: Model): boolean {
        const isLeaf = item.get('parent@') === null;

        if (itemAction.id === 1) {
            return !isLeaf;
        }

        return isLeaf;
    }
}
