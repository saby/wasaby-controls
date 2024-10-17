import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Masks/Masks');

export default class Masks extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
