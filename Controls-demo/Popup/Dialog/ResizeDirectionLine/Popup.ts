import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Dialog/ResizeDirectionLine/Popup');

class Popup extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _resizingOptions: object = {};

    protected _beforeMount(options): void {
        this._resizingOptions = options.resizingOptions;
    }
}
export default Popup;
