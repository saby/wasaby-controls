import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Popup/Stack/BaseWidthSizes/Template');

class PopupStack extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _restrictiveContainer: string = '.popup-page-target-container';
    protected _sizes: string[] = ['a', 'b', 'c', 'd', 'e'];
    protected openStack(event: Event, size: string): void {
        this._children.stack.open({
            opener: this._children.button1,
            closeOnOutsideClick: true,
            restrictiveContainer: this._restrictiveContainer,
            template: 'Controls-demo/Popup/Opener/resources/StackTemplate',
            width: size,
        });
    }
}
export default PopupStack;
