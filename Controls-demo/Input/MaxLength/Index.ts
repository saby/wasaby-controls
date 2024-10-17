import { query } from 'Application/Env';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/MaxLength/MaxLength');

class MaxLength extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _beforeMount(): void {
        this._forTest = query.get.forTest ? true : false;
    }
}

export default MaxLength;
