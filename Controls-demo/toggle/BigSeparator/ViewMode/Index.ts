import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/BigSeparator/ViewMode/ViewMode');

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _expandedFilled: boolean = false;
    protected _expandedGhost: boolean = false;
}

export default Index;
