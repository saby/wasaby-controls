import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Number/FractionSize/FractionSize');
import 'css!Controls/CommonClasses';

class FractionSize extends Control<IControlOptions> {
    protected _value: string = '12345.6789';
    protected _template: TemplateFunction = controlTemplate;
}

export default FractionSize;
