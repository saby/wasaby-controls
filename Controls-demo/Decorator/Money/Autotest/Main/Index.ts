import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/Autotest/Main/Template');
import 'css!Controls/CommonClasses';

class Main extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Main;
