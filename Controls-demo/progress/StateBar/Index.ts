import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/progress/StateBar/Template');

class StateBar extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
}

export default StateBar;
