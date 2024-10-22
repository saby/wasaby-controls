import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Heading/Heading');

class Heading extends Control<IControlOptions> {
    protected _expanded: boolean = true;

    protected _template: TemplateFunction = controlTemplate;
}
export default Heading;
