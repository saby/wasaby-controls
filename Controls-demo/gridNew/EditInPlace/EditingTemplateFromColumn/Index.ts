import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';

import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditingTemplateFromColumn/EditingTemplateFromColumn';
import 'css!Controls-demo/gridNew/EditInPlace/EditingTemplateFromColumn/EditingTemplateFromColumn';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        const data = Editing.getEditingData();
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }
}
