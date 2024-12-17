import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Number/Number');
import 'css!Controls/CommonClasses';

class Number extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Number;
