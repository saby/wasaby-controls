import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/PlaceholderVisibility/Index');

export default class PlaceholderVisibility extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
