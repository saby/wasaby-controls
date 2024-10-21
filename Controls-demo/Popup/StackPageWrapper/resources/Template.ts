import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Popup/StackPageWrapper/resources/Template';
import { StackOpener } from 'Controls/popup';
import { Button } from 'Controls/buttons';

export default class TemplateDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _stackOpener: StackOpener = new StackOpener();
    protected _children: {
        button: Button;
    };

    protected _onClick(): void {
        this._stackOpener.open({
            template: 'Controls-demo/Popup/StackPageWrapper/resources/Template',
            opener: this._children.button,
        });
    }

    protected _close(): void {
        this._notify('close', [], { bubbling: true });
    }
}
