import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Number/FontColorStyle/Template');
import 'css!Controls/CommonClasses';
import 'css!Controls-demo/Decorator/Money/FontColorStyle/Style';

class FontColorStyle extends Control<IControlOptions> {
    protected _value: number = 123.45;
    protected _template: TemplateFunction = controlTemplate;
}

export default FontColorStyle;
