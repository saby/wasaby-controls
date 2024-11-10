import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Money/HighlightedValue/Template');
import 'css!Controls/CommonClasses';

export default class HighlightedValue extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
