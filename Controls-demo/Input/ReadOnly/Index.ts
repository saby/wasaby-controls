import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/ReadOnly/Template');

class ReadOnly extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default ReadOnly;
