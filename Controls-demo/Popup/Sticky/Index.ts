import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Popup/Sticky/Template');
import 'wml!Controls-demo/Popup/Opener/DialogTpl';
import 'wml!Controls-demo/Popup/Opener/DialogTpl';

class PopupStack extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected openSticky(): void {
        this._children.sticky.open({
            target: this._children.stickyButton._container,
            opener: this._children.stickyButton,
            template: 'wml!Controls-demo/Popup/Opener/DialogTpl',
        });
    }

    static _styles: string[] = [
        'Controls-demo/Popup/PopupPage',
        'Controls-demo/Popup/Opener/resources/StackHeader',
    ];
}
export default PopupStack;
