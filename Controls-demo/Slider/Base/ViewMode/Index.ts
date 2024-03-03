import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/ViewMode/Template');
import 'css!Controls-demo/Slider/Base/ViewMode/Style';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
}

export default Base;
