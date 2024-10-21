import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Number/RoundMode/RoundMode');
import 'css!Controls/CommonClasses';

class RoundMode extends Control<IControlOptions> {
    protected _value: string = '12345.6789';
    protected _precision: number = 2;
    protected _template: TemplateFunction = controlTemplate;
}

export default RoundMode;
