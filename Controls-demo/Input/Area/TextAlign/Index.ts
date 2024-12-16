import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Area/TextAlign/Index');

class TextAlignments extends Control<IControlOptions> {
    protected _rightValue: string = TextAlignments._defaultValue;
    protected _leftValue: string = TextAlignments._defaultValue;
    protected _centerValue: string = TextAlignments._defaultValue;
    protected _template: TemplateFunction = controlTemplate;
    private static _defaultValue: string = 'text';
}

export default TextAlignments;
