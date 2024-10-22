import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/Search/Search';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { HierarchicalMemory, Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { TRoot } from 'Controls-demo/types';
import { IItemAction } from 'Controls/interface';
import * as MemorySource from 'Controls-demo/explorerNew/ExplorerMemory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: MemorySource;
    protected _columns: IColumn[] = Gadgets.getSearchColumns();
    protected _root: TRoot = 1;
    protected _startingWith: 'root' | 'current' = 'root';
    protected _startingWithBtnCaption: 'root' | 'current' = 'current';
    protected _startingWithSource: Memory = null;
    private _multiselect: 'visible' | 'hidden' = 'hidden';
    // eslint-disable-next-line
    protected _filter: object = { demo: 123 };
    protected _dedicatedItemProperty: string;

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
        this._startingWithSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 'root',
                    title: 'root',
                },
                {
                    id: 'current',
                    title: 'current',
                },
            ],
        });
    }

    protected _onToggle(): void {
        this._multiselect = this._multiselect === 'visible' ? 'hidden' : 'visible';
    }

    protected _onToggleDedicatedItemProperty(): void {
        this._dedicatedItemProperty = !this._dedicatedItemProperty ? 'SearchResult' : undefined;
    }

    protected _updateStartingWith(): void {
        this._startingWithBtnCaption = this._startingWith;
        this._startingWith = this._startingWith === 'root' ? 'current' : 'root';
    }
}
