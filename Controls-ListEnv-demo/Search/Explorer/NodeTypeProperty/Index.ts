import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';
import { Model } from 'Types/entity';
import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { IItemAction } from 'Controls/interface';
import { IGroupNodeColumn } from 'Controls/treeGrid';

import { columns, data } from './data/NodeTypePropertyData';
import { memoryFilter } from 'Controls-ListEnv-demo/Search/DataHelpers/memoryFilter';
import * as Template from 'wml!Controls-ListEnv-demo/Search/Explorer/NodeTypeProperty/NodeTypeProperty';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = columns;
    protected _root: CrudEntityKey = null;
    protected _expandedItems: CrudEntityKey[] = [1, 2, 3];
    protected _collapsedItems: CrudEntityKey[] = [];

    protected _itemActions: IItemAction[] = [
        {
            id: 0,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete pls',
            showType: 0,
            handler: (item) => {
                this._children.explorerView.removeItems({
                    selectedKeys: [item.getKey()],
                    excludedKeys: [],
                });
            },
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data,
            filter: memoryFilter,
        });
    }

    protected _colspanCallback(
        item: Model,
        column: IGroupNodeColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        if (item.get('nodeType') === 'group' && columnIndex === 0) {
            return 3;
        }
        return 1;
    }

    // static g_etLoadConfi_g(): Record<string, IDataConfig<IListDataFactoryArguments>> {
    //     return {
    //         listData: {
    //             dataFactoryName: 'Controls/dataFactory:List',
    //             dataFactoryArguments: {
    //                 displayProperty: 'title',
    //                 source: new ExpandedSource({
    //                     keyProperty: 'key',
    //                     parentProperty: 'parent',
    //                     data: getData(),
    //                     useMemoryFilter: true,
    //                 }),
    //                 root: null,
    //                 viewMode: 'table',
    //                 keyProperty: 'key',
    //                 parentProperty: 'parent',
    //                 nodeProperty: 'type',
    //                 searchParam: 'title',
    //                 minSearchLength: 3,
    //                 expandedItems: [1, 2, 3],
    //                 deepReload: true,
    //                 searchNavigationMode: 'expand',
    //                 nodeTypeProperty: 'nodeType',
    //             },
    //         },
    //     };
    // }
}
