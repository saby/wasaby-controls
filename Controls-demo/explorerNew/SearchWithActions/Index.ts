import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { Model } from 'Types/entity';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { TRoot } from 'Controls-demo/types';
import { IItemAction } from 'Controls/itemActions';

import { Gadgets } from '../DataHelpers/DataCatalog';
import { memoryFilter } from 'Controls-demo/treeGridNew/DemoHelpers/Filter/memoryFilter';

import * as Template from 'wml!Controls-demo/explorerNew/SearchWithActions/SearchWithActions';

const columns: IColumn[] = [
    {
        displayProperty: 'title',
        width: '400px',
    },
    {
        displayProperty: 'code',
        width: '150px',
    },
    {
        displayProperty: 'price',
        width: '150px',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = columns;
    protected _root: TRoot = null;
    // eslint-disable-next-line
    protected _filter: object = { demo: 123 };
    protected _header: IHeaderCell[] = Gadgets.getSearchHeader();

    protected _itemActions: IItemAction[] = [
        {
            id: 0,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete pls',
            showType: 0,
            handler: (item) => {
                this._children.explorer
                    .removeItems({
                        selected: [item.getKey()],
                        excluded: [],
                    })
                    .then(() => {
                        this._children.explorer.reload();
                    });
            },
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getSearchDataLongFolderName(),
            filter(item: Model, filter: object): boolean {
                return memoryFilter.call(this, item, filter, 'id');
            },
        });
    }

    protected _onToggle(): void {
        this._multiselect =
            this._multiselect === 'visible' ? 'hidden' : 'visible';
    }
}
