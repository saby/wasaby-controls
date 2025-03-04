import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls-demo/skeleton/Base/Template';
import 'css!Controls-demo/skeleton/Base/Style';

export default class IconDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
