import { Control, TemplateFunction } from 'UI/Base';
import { IItemAction } from 'Controls/itemActions';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';

import * as Template from 'wml!Controls-demo/explorerNew/SeparatorAndActions/SeparatorAndActions';
import * as CellTemplate from 'wml!Controls-demo/explorerNew/SeparatorAndActions/CellTemplate';

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
        template: CellTemplate,
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _header: IHeaderCell[] = Gadgets.getSearchHeader();
    protected _columns: IColumn[] = columns;
    protected _searchValue: string = 'sata';
    protected _itemActions: IItemAction[] = [
        {
            id: 0,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete pls',
            showType: 0,
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getSmallSearchData(),
            filter: () => {
                return true;
            },
        });
    }
}
