import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-rating-demo/Thumbs/IconSize/Template';

export default class IconSize extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _value1: number | null = null;
    protected _value2: number | null = null;
}
