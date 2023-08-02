import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/treeGridNew/EditArrow/BackgroundStyle/BackgroundStyle';
import * as TreeMemory from 'Controls-demo/List/Tree/TreeMemory';
import * as memorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';

import 'css!Controls-demo/treeGridNew/EditArrow/resources/EditArrow';

import {
    TreeData,
    TreeColumns,
    TreeHeader,
} from 'Controls-demo/treeGridNew/EditArrow/resources/resources';

export default class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _source: typeof TreeMemory;
    protected _columns: IColumn[];
    protected _header: IHeaderCell[];
    protected _collapsedItems: CrudEntityKey[] = [];
    protected _expandedItems: CrudEntityKey[] = [null];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._source = new TreeMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            filter: memorySourceFilter(),
            data: TreeData,
        });
        this._columns = TreeColumns;
        this._header = TreeHeader;
    }

    protected _getHighlightOnHover(item: Model): boolean {
        return item.getKey() !== 1 && item.getKey() !== 2;
    }

    protected _getHoverBackgroundStyle(item: Model): string {
        switch (item.getKey()) {
            case 3:
                return 'danger';
            case 4:
                return 'success';
            case 5:
                return 'transparent';
            default:
                return;
        }
    }
}
