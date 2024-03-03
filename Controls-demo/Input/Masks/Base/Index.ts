import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Masks/Base/Masks');

export default class Masks extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _value: string = '';
    protected _value1: string = '';
    protected _value2: string = '';
    protected _value3: string = '';
    protected _masks: string[] = [
        'L ddd LL ddd',
        'L dddd dd',
        'ddd LL d dd',
        'LL dddd dd',
        'xxxxxxxxxxxxxxxxxxxx',
    ];
}
