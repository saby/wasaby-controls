import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlock/Position/Position');

export default class Position extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
