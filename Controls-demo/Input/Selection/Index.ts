import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Input/Selection/Selection';

class Selection extends Control<IControlOptions> {
    protected _selectionStart: number = 3;
    protected _selectionEnd: number = 3;
    protected _value: string = 'hello world';
    protected _template: TemplateFunction = template;
}

export default Selection;
