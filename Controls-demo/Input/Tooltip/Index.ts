import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Tooltip/Tooltip');

class Tooltip extends Control<IControlOptions> {
    protected _short: string = 'short';
    protected _long: string = 'long long long long long long long long long long long long';
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;
}

export default Tooltip;
