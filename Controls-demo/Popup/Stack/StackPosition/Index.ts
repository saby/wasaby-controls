import { Control, TemplateFunction } from 'UI/Base';
import { StackOpener, Controller } from 'Controls/popup';
import * as Template from 'wml!Controls-demo/Popup/Stack/StackPosition/StackPosition';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _stackOpener: StackOpener = new StackOpener();

    _openStack(): void {
        this._stackOpener.open({
            template: 'Controls-demo/Popup/Stack/doc/Template/Index',
            opener: this,
            width: 900,
            stackPosition: 'left',
        });
    }
}
