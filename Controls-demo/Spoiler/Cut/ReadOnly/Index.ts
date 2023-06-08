import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Cut/ReadOnly/ReadOnly');
import 'Controls/buttons';

class LineHeight extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default LineHeight;
