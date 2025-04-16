import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Classes/Blocks/Contrast/Template');

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _gradientStyles: string[] = [
        'secondary',
        'primary',
        'success',
        'info',
        'danger',
        'warning',
        'unaccented',
    ];
}

export default ViewModes;
