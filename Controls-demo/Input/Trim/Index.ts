import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Trim/Trim');

class Trim extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Trim;
