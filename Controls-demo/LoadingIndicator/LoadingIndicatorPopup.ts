import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/LoadingIndicatorPopup');

class LoadingIndicatorPopup extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _load(): void {
        this._children.dialog.open();
    }
}
export default LoadingIndicatorPopup;
