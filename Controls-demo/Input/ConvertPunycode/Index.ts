import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/ConvertPunycode/ConvertPunycode');

class ConvertPunycode extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _copyText(): void {
        const input = document.getElementById('text');
        input.select();
        document.execCommand('copy');
    }
}

export default ConvertPunycode;
