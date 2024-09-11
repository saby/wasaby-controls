import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls-demo/Icon/Icon';
import 'font!Controls-icons/actions';

export default class IconDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
