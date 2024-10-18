import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Buttons/Base/Template');

class Direction extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _buttonStyles: string[] = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'pale',
    ];
}

export default Direction;
