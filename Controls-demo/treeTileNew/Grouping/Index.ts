import { HierarchicalMemory } from 'Types/source';
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/treeTileNew/Grouping/Index';
import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';

/**
 * Демка для автотеста по группировке в плитке
 */
export default class extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: HierarchicalMemory;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getData(),
        });
    }
}
