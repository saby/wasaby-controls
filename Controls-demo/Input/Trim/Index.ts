import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Trim/Trim');

class Trim extends Control<IControlOptions> {
    protected _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}

export default Trim;
