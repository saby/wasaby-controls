import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/Stroked/Stroked');
import 'css!Controls/CommonClasses';

class Value extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Value;
