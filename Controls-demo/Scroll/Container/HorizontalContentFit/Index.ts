import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Container/HorizontalContentFit/Template');
import 'css!Controls-demo/Scroll/Container/HorizontalContentFit/Style';

export default class HorizontalContentFitDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
