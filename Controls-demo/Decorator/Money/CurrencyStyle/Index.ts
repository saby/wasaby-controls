import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/CurrencyStyle/Template');
import 'css!Controls/CommonClasses';

export default class CurrencyStyle extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: string = '123.45';
    protected _baseStyles: string[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'unaccented',
                                                                                     'link' ,'label', 'info','default'];
}

