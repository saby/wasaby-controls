import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlockReact/ForTests/MultipleBlocks/Index');
import 'css!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Style';

export default class MultipleBlocks extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
