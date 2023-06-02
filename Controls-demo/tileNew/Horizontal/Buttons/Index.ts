import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tileNew/Horizontal/Buttons/Template';
import { Gadgets } from '../../DataHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _tileWidthSource: Memory;
    protected _tileWidth: number = 200;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getPreviewItems(),
        });
        this._tileWidthSource = new Memory({
            keyProperty: 'id',
            data: [{ id: 200 }, { id: 1000 }],
        });
    }
}
