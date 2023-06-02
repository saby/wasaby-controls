import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/SequentialEditingMode/SequentialEditingMode';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/EditInPlace/EditingCell/_cellEditor';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumnRes[] = Editing.getEditingColumns();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Editing.getEditingData(),
        });
    }
}
