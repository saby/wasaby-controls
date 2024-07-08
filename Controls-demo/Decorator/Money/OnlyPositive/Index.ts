import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/OnlyPositive/OnlyPositive');
import 'css!Controls/CommonClasses';

class OnlyPositive extends Control<IControlOptions> {
    private _value: string = '-123.45';
    protected _template: TemplateFunction = controlTemplate;
}

export default OnlyPositive;
