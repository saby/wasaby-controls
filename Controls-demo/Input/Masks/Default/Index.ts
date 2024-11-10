import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Masks/Default/Template');

export default class Masks extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _value1: string = '';
    protected _value2: string = '1234 0000 1253 4321';
    protected _value3: string = 'С065мк';

    protected _formatMaskChars: object = {
        x: '[А-Яa-я]',
        y: '[0-9]',
    };
}
