import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { View } from 'Controls/treeGrid';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/MoreButton/MoreButton';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumnsWithNodeFooters(true);

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
            buttonView: 'separator',
        },
    };

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: Flat.getData(),
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
}
