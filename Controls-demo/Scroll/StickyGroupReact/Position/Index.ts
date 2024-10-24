import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyGroupReact/Position/Index');
import 'css!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Style';

export default class ManyProps extends Control<IControlOptions> {
    readonly _template: TemplateFunction = controlTemplate;
}
