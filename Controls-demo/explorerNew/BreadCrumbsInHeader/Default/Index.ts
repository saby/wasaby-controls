import { Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { TRoot } from 'Controls-demo/types';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { Control, TemplateFunction } from 'UI/Base';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Gadgets } from '../../DataHelpers/DataCatalog';
import { TBreadcrumbsVisibility, View as Explorer } from 'Controls/explorer';
import * as template from 'wml!Controls-demo/explorerNew/BreadCrumbsInHeader/Default/Default';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _children: {
        explorer: Explorer;
    };

    protected _root: TRoot = 1;
    protected _itemActions: IItemAction[];
    protected _viewSource: HierarchicalMemory;
    protected _header: IHeaderCell[] = Gadgets.getHeader();
    protected _columns: IColumn[] = Gadgets.getGridColumns();

    protected _breadcrumbsVisibility: TBreadcrumbsVisibility = 'visible';
    protected _breadcrumbsVisibilitySource: Memory = new Memory({
        keyProperty: 'id',
        data: [{ id: 'hidden' }, { id: 'visible' }, { id: 'onlyBackButton' }],
    });

    private _needResults: boolean = true;
    protected get _resultsVisible(): boolean {
        return this._needResults;
    }
    protected set _resultsVisible(value: boolean) {
        this._needResults = value;
        this._children.explorer?.reload();
    }

    private _needHeader: boolean = true;
    protected get _headerVisible(): boolean {
        return this._needHeader;
    }
    protected set _headerVisible(value: boolean) {
        this._needHeader = value;

        if (value) {
            this._header = Gadgets.getHeader();
        } else {
            this._header = [];
        }
    }

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getData(),
        });

        this._columns[0].width = '290px';

        this._itemActions = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                showType: 2,
            },
            {
                id: 2,
                icon: 'icon-EmptyMessage',
                title: 'message',
                showType: 2,
            },
        ];

        this._dataLoadCallback = this._dataLoadCallback.bind(this);
    }

    private _dataLoadCallback(items: RecordSet): void {
        if (!this._needResults) {
            return;
        }

        items.setMetaData({
            ...items.getMetaData(),
            results: Model.fromObject(
                {
                    discr: 10,
                    price: 10,
                },
                items.getAdapter()
            ),
        });
    }
}
