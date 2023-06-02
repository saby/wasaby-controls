import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/Overlay/Overlay');

class Overlay extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    _afterMount(): void {
        this._children.LocalIndicatorDefault.show({});
        this._children.LocalIndicatorNone.show({});
        this._children.LocalIndicatorDark.show({});
    }

    static _styles: string[] = [
        'Controls-demo/LoadingIndicator/IndicatorContainer',
    ];
}
export default Overlay;
