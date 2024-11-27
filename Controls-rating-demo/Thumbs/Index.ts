import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-rating-demo/Thumbs/Template';

export default class Thumbs extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _value: number | null = null;
}
