import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/CustomFooter/CustomFooter';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { View } from 'Controls/treeGrid';
import { Model } from 'Types/entity';
import { IItemAction, TItemActionVisibilityCallback } from 'Controls/itemActions';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { INavigationOptionValue, INavigationSourceConfig } from 'Controls/interface';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumnsWithNodeFooters();
    protected _hoveredCellIndex: number = -1;
    protected _isNodeFooterVisible: boolean;
    protected _isItemActionVisible: boolean;
    protected _nodeFooterVisibilityCallback: (contents?: Model) => boolean;
    protected _itemActionVisibilityCallback: TItemActionVisibilityCallback;
    protected _itemActions: IItemAction[] = getItemActions();

    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = {
        source: 'page',
        view: 'demand',
        sourceConfig: {
            pageSize: 3,
            page: 0,
            hasMore: false,
        },
        viewConfig: {
            pagingMode: 'basic',
        },
    };

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'Apple',
                    country: 'США',
                    rating: '8.5',
                    parent: null,
                    type: true,
                },
                {
                    key: 11,
                    title: 'Notebooks',
                    country: 'США',
                    rating: '8.5',
                    parent: 1,
                    type: false,
                },
                {
                    key: 12,
                    title: 'IPhones',
                    country: 'США',
                    rating: '8.5',
                    parent: 1,
                    type: false,
                },
                {
                    key: 121,
                    title: 'IPhone XS',
                    country: 'США',
                    rating: '8.5',
                    parent: 12,
                    type: null,
                },
                {
                    key: 122,
                    title: 'IPhone X',
                    country: 'США',
                    rating: '8.5',
                    parent: 12,
                    type: null,
                },
                {
                    key: 13,
                    title: 'iPad Air 2015',
                    country: 'США',
                    rating: '8.5',
                    parent: 1,
                    type: null,
                },
                {
                    key: 14,
                    title: 'iPad Air 2017',
                    country: 'США',
                    rating: '8.5',
                    parent: 1,
                    type: null,
                },
            ],
            parentProperty: 'parent',
        });
        this._isNodeFooterVisible = true;
        this._isItemActionVisible = true;
        this._bindCallbacks();
    }

    protected _afterMount(): void {
        this._toggleNodes(this._children.tree4);
    }

    private _toggleNodes(tree: View): void {
        tree.toggleExpanded(1)
            .then(() => {
                return tree.toggleExpanded(11);
            })
            .then(() => {
                return tree.toggleExpanded(12);
            });
    }

    protected _resetCallbacks(): void {
        this._isNodeFooterVisible = !this._isNodeFooterVisible;
        this._isItemActionVisible = !this._isItemActionVisible;
        this._bindCallbacks();
    }

    private _bindCallbacks(): void {
        this._nodeFooterVisibilityCallback = this._getNodeFooterVisibilityCallback(
            this._isNodeFooterVisible
        ).bind(this);
        this._itemActionVisibilityCallback = this._getItemActionsVisibilityCallback(
            this._isItemActionVisible
        ).bind(this);
    }

    private _getNodeFooterVisibilityCallback(visible: boolean): (contents?: Model) => boolean {
        const returningTrue = (contents?: Model) => {
            return true;
        };
        const returningFalse = (contents?: Model) => {
            return false;
        };
        return visible ? returningTrue : returningFalse;
    }

    private _getItemActionsVisibilityCallback(visible: boolean): TItemActionVisibilityCallback {
        const returningTrue = (action: IItemAction, item: Model, isEditing: boolean) => {
            return true;
        };
        const returningFalse = (action: IItemAction, item: Model, isEditing: boolean) => {
            return false;
        };
        return visible ? returningTrue : returningFalse;
    }

    // static g_etLoadConfi_g(): Record<string, IDataConfig<IListDataFactoryArguments>> {
    //     return {
    //         NodeFooterCustomFooter: {
    //             dataFactoryName: 'Controls/dataFactory:List',
    //             dataFactoryArguments: {
    //                 displayProperty: 'title',
    //                 source: new ExpandedSource({
    //                     keyProperty: 'key',
    //                     parentProperty: 'parent',
    //                     data: getData(),
    //                     useMemoryFilter: true,
    //                     multiNavigation: true,
    //                 }),
    //                 keyProperty: 'key',
    //                 parentProperty: 'parent',
    //                 nodeProperty: 'type',
    //                 multiSelectVisibility: 'visible',
    //                 navigation: {
    //                     source: 'page',
    //                     view: 'demand',
    //                     sourceConfig: {
    //                         pageSize: 3,
    //                         page: 0,
    //                         hasMore: false,
    //                         multiNavigation: true,
    //                     },
    //                     viewConfig: {
    //                         pagingMode: 'basic',
    //                     },
    //                 },
    //                 deepReload: true,
    //                 expandedItems: [1, 11, 12],
    //             },
    //         },
    //     };
    // }
}
