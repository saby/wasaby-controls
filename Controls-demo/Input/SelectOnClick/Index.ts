import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/SelectOnClick/SelectOnClick');

class SelectOnClick extends Control<IControlOptions> {
    protected _value: string = 'text';
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;
}

export default SelectOnClick;
