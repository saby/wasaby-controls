import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyGroupReact/Default/Index');
import 'css!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Style';

export default class Default extends Control<IControlOptions> {
    readonly _template: TemplateFunction = controlTemplate;
}
