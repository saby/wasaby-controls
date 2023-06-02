import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/Message/Message');

class Overlay extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    _afterMount(): void {
        this._children.LocalIndicator.show({});
        this._children.LocalIndicatorDefault.show({});
    }

    static _styles: string[] = [
        'Controls-demo/LoadingIndicator/IndicatorContainer',
    ];
}
export default Overlay;
