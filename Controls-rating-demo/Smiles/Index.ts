import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-rating-demo/Smiles/Template';

export default class Smiles extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _value: number | null = null;
}
