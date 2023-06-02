import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/HeadingLeft/HeadingLeft');

class SecondScenario extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _expanded: boolean = true;
}
export default SecondScenario;
