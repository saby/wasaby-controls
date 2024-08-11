import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Cut/Expanded/Expanded');

class Expanded extends Control<IControlOptions> {
    protected _expanded: boolean = false;
    protected _template: TemplateFunction = controlTemplate;
}

export default Expanded;
