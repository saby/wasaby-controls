import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/progress/Bar/Base/Template');

class Bar extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
}

export default Bar;
