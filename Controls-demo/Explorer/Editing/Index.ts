import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Explorer/Editing/Editing';
import Memory = require('Controls-demo/Explorer/ExplorerMemory');
import { Gadgets } from '../../explorerNew/DataHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: object[] = Gadgets.getGridEditingCol();

    _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: Gadgets.getData(),
        });
    }
}
