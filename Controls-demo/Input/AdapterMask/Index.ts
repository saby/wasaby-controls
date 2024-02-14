import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/AdapterMask/Template');

class Mask extends Control<IControlOptions> {
    protected _valueAdapterMask: string = '874998';
    protected _formatMaskChars: object = {
        d: '[0-9]',
    };

    protected _template: TemplateFunction = controlTemplate;
}

export default Mask;
