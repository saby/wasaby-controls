import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/BigSeparator/IconMode/IconMode');

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _expandedEllipsis: boolean = false;
    protected _expandedArrow: boolean = false;
}

export default Index;
