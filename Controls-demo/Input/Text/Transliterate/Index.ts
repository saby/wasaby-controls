import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Text/Transliterate/Template');

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Demo;
