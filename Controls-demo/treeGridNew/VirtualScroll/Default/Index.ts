import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/VirtualScroll/Default/Default';
import { CrudEntityKey, DataSet, HierarchicalMemory, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IColumn } from 'Controls/grid';
import { View } from 'Controls/treeGrid';
import { VirtualScrollHasMore } from 'Controls-demo/treeGridNew/DemoHelpers/Data/VirtualScrollHasMore';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

class MultiNavigationMemory extends HierarchicalMemory {
    query(query?: Query): Promise<DataSet> {
        const parentProperty = this._$parentProperty;
        const keyProperty = this._keyProperty;
        const where = query.getWhere();
        const parents: CrudEntityKey[] = where[parentProperty]?.length
            ? where[parentProperty]
            : [where[parentProperty]];

        const items = [];
        const hasMore = [];
        parents.forEach((parent) => {
            const nodeQuery =
                query.getUnion().find((q) => {
                    return q.getWhere().__root._value === parent;
                }) || query;
            const limit = nodeQuery.getLimit();
            const offset = nodeQuery.getOffset();
            const position = nodeQuery.getWhere()[keyProperty + '>='] || offset || 0;
            const itemsWithParent: object[] = this.data.filter((item) => {
                return item[parentProperty] === parent;
            });
            hasMore.push({
                id: parent,
                nav_result: itemsWithParent.length,
            });
            const itemsWithParentWithLimit = itemsWithParent.slice(position, position + limit);
            items.push(...itemsWithParentWithLimit);
        });

        const meta = {
            more: new RecordSet({ keyProperty: 'id', rawData: hasMore }),
        };
        const data = new DataSet({
            keyProperty,
            itemsProperty: 'items',
            metaProperty: 'meta',
            rawData: { items, meta },
        });

        return Promise.resolve(data);
    }
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: MultiNavigationMemory;
    protected _expandedItems: number[];
    protected _columns: IColumn[];
    protected _children: {
        tree: View;
    };

    protected _beforeMount(): void {
        this._columns = Flat.getColumns();
        this._columns[1].width = '50px';
        this._columns[2].width = '200px';

        this._viewSource = new MultiNavigationMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: VirtualScrollHasMore.getDataForVirtual(),
        });
    }
    protected _expandAll(): void {
        this._expandedItems = [null];
        this._viewSource = new MultiNavigationMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: VirtualScrollHasMore.getDataForVirtual(),
            filter: (): boolean => {
                return true;
            },
        });
    }
    protected _reload(): void {
        this._viewSource.data.forEach((elem) => {
            elem.title += '*';
        });
        this._children.tree.reload(true);
    }
}
//
// export default Object.assign(connectToDataContext(Demo), {
//     g_etLoadConfi_g(): Record<string, IDataConfig<IListDataFactoryArguments>> {
//         return {
//             VirtualScrollDefault: {
//                 dataFactoryName: 'Controls/dataFactory:List',
//                 dataFactoryArguments: {
//                     displayProperty: 'title',
//                     source: new MultiNavigationMemory({
//                         keyProperty: 'key',
//                         parentProperty: 'parent',
//                         data: getData(),
//                     }),
//                     keyProperty: 'key',
//                     parentProperty: 'parent',
//                     nodeProperty: 'type',
//                     deepReload: true,
//                     navigation: {
//                         source: 'page',
//                         view: 'infinity',
//                         sourceConfig: {
//                             pageSize: 9,
//                             page: 0,
//                             hasMore: false,
//                             multiNavigation: true,
//                         },
//                         viewConfig: {
//                             pagingMode: 'hidden',
//                         },
//                     },
//                 },
//             },
//         };
//     },
// });
