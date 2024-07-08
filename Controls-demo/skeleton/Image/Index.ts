import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls-demo/skeleton/Image/Template';

export default class IconDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
