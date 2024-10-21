import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/Autotest/Additional/Template');
import 'css!Controls/CommonClasses';

class Additional extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Additional;
