import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/Small/Small');

class Small extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    _afterMount(): void {
        this._children.LocalIndicatorDefault.show({});
        this._children.LocalIndicatorSmall.show({});
    }

    static _styles: string[] = ['Controls-demo/LoadingIndicator/IndicatorContainer'];
}
export default Small;
