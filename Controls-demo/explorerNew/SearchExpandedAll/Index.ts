import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/SearchExpandedAll/SearchExpandedAll';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { TRoot } from 'Controls-demo/types';
import { IItemAction } from 'Controls/interface';
import * as MemorySource from 'Controls-demo/explorerNew/ExplorerMemory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: MemorySource;
    protected _columns: IColumn[] = Gadgets.getSearchColumns();
    protected _root: TRoot = 1;
    // eslint-disable-next-line
    protected _filter: object = { Разворот: 'С разворотом' };
    protected _expandedItems: number[] = [null];

    protected _itemActions: IItemAction[] = [
        {
            id: 0,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete pls',
            showType: 0,
            handler: (item) => {
                this._children.remover.removeItems([item.getKey()]);
            },
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new MemorySource({
            keyProperty: 'id',
            data: Gadgets.getSearchData(),
        });
    }

    protected _filterChanged(): void {
        // после сброса поиска браузер сбрасывает в фильтре разворот, восстанавливаем его
        this._filter.Разворот = 'С разворотом';
    }
}
