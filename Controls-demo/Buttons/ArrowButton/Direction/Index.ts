import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/ArrowButton/Direction/Direction');

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Demo;
