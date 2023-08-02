import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/ShadowMode/Rounded/Template');

export default class Rounded extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
