import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlockReact/Position/Index');
import 'css!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Style';

export default class Position extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
