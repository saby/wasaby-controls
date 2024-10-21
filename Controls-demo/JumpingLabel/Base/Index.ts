import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/JumpingLabel/Base/Template');

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _name: string = 'Maxim';
}

export default Base;
