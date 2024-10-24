import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls-demo/skeleton/Integration/Composite/Template';
import 'css!Controls-demo/skeleton/Composite/Style';

export default class IconDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
