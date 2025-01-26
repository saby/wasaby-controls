import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Input/Base/Template');

class Direction extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _filledValue: string = 'text';
    protected _outlinedValue: string = 'text';
    protected _numberValue: number = 1234.56;
    protected _maskValue: string;
    protected _jumpingValue: string;
    protected _areaValue: string = 'text';
}

export default Direction;
