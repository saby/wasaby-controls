import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/markerVisibility/Template');

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
}

export default Base;
