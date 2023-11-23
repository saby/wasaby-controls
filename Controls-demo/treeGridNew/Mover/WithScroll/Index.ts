import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
    ISelectionObject,
} from 'Controls/interface';
import { VirtualScrollHasMore } from 'Controls-demo/treeGridNew/DemoHelpers/Data/VirtualScrollHasMore';

import { memoryFilter as moverMemoryFilter } from 'Controls-demo/treeGridNew/DemoHelpers/Filter/memoryFilter';

import * as Template from 'wml!Controls-demo/treeGridNew/Mover/WithScroll/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[];
    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            direction: undefined,
            pageSize: 9,
            page: 0,
            hasMore: false,
        },
        viewConfig: {
            pagingMode: 'hidden',
        },
    };
    private _selectedKeys: CrudEntityKey[] = [];
    private _excludedKeys: CrudEntityKey[] = [];

    protected _beforeMount(): void {
        this._columns = [
            {
                displayProperty: 'title',
                width: '',
            },
        ];

        const data = VirtualScrollHasMore.getDataForVirtual();
        data.find((item) => {
            return item.key === 76;
        }).title = 'WebKit is a browser engine developed by Apple';

        this._viewSource = new HierarchicalMemory({
            parentProperty: 'parent',
            keyProperty: 'key',
            data,
            filter: moverMemoryFilter,
        });
    }

    protected _moveButtonClick(): void {
        if (this._selectedKeys?.length) {
            const selection: ISelectionObject = {
                selected: this._selectedKeys,
                excluded: this._excludedKeys,
            };
            this._children.treeGrid.moveItemsWithDialog(selection).then(() => {
                this._selectedKeys = [];
                this._children.treeGrid.reload();
            });
        }
    }
}
