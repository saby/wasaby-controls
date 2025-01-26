import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/ShadowMode/Template');
import 'css!Controls-demo/Scroll/ScrollMode/Style';

export default class ShadowMode extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
