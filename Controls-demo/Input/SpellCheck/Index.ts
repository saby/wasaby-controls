import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/SpellCheck/SpellCheck');

class SpellCheck extends Control<IControlOptions> {
    protected _value: string = 'Сдравстуйте май друх!!!';

    protected _template: TemplateFunction = controlTemplate;
}
export default SpellCheck;
