import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { TScrollMode } from 'Controls/scroll';

import * as Template from 'wml!Controls-demo/tileNew/Horizontal/Scroll/Template';
import { Gadgets } from '../../DataHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _scrollMode: TScrollMode = 'scrollbar';
    protected _orientation: 'vertical' | 'horizontal' = 'horizontal';

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getPreviewItems(),
        });
    }
}
