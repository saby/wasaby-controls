import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/MarkupTest/MarkupTest');

class MarkupTest extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static _styles: string[] = ['Controls-demo/LoadingIndicator/MarkupTest/MarkupTest'];
}
export default MarkupTest;
