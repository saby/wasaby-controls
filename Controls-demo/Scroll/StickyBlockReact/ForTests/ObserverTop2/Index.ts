import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlockReact/ForTests/ObserverTop2/Index');

export default class ObserverTop2 extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
