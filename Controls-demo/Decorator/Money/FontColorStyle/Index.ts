import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/FontColorStyle/FontColorStyle');
import 'css!Controls/CommonClasses';
import 'css!Controls-demo/Decorator/Money/FontColorStyle/Style';

class FontColorStyle extends Control<IControlOptions> {
    private _value: string = '123.45';
    protected _value1: string = '123.00';
    protected _template: TemplateFunction = controlTemplate;
}

export default FontColorStyle;
