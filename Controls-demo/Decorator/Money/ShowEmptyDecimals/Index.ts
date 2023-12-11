import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/ShowEmptyDecimals/ShowEmptyDecimals');
import 'css!Controls/CommonClasses';

class ShowEmptyDecimals extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default ShowEmptyDecimals;
