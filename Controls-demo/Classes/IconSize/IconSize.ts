import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Classes/IconSize/IconSize');
import 'css!Controls/CommonClasses';

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default ViewModes;
