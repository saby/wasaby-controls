import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Masks/Replacer/Masks');

export default class Masks extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _value1: string = '';
    protected _value2: string = '';
    protected _value3: string = '';
}
