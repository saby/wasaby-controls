import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Validate/isValid/Template');

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: string = '';
    protected _validityState: boolean;

    protected _validateHandler() {
        this._validityState = this._children.InputValidate.isValid();
    }
}

export default Demo;
