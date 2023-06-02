import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/DefaultFooter/DefaultFooter';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { View } from 'Controls/treeGrid';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumns().map((c) => {
        return { ...c, compatibleWidth: '150px' };
    });
    protected _hoveredCellIndex: number = -1;

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
            parentProperty: 'parent',
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
        });
    }

    protected _afterMount(): void {
        this._toggleNodes(this._children.tree2);
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

    // eslint-disable-next-line
    protected _hoveredCellChanged(
        _: SyntheticEvent,
        item: any,
        itemContainer: any,
        cell: any
    ): void {
        this._hoveredCellIndex = cell === null ? -1 : cell;
    }
}
