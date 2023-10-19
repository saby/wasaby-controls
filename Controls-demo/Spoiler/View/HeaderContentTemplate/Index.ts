import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/View/HeaderContentTemplate/HeaderContentTemplate');

class HeaderContentTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default HeaderContentTemplate;
