import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/CurrencySize/CurrencySize');
import 'css!Controls/CommonClasses';

class Value extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: string = '123.45';
    protected _baseSizes: string[] = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl'];
}

export default Value;
