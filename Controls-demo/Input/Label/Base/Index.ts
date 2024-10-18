import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Label/Base/Index');

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _placeholder: string = 'Подсказка';
}

export default Base;
