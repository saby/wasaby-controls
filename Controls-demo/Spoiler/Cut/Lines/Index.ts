import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Cut/Lines/Lines');
import 'Controls/buttons';

class Lines extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Lines;
