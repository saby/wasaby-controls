import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Search/Input/ContrastBackground/Index');

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/Search/Input/Base/Style'];
}
export default ViewModes;
