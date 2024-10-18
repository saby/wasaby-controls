import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlockReact/Default/Index');

export default class Default extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
