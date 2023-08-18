import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/Cut/Content/Content');
import 'Controls/buttons';

class Content extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default Content;
