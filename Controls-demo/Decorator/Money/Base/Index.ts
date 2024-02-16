import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/Base/Money');
import 'css!Controls/CommonClasses';

class Money extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Money;
