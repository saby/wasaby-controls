import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EmptyList/Editing/Editing';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [],
        });
    }

    protected _beginAdd(): void {
        this._children.list.beginAdd();
    }
}
