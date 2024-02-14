import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Classes/Offsets/Template');
import 'css!Controls/CommonClasses';
import 'css!Controls-demo/Classes/Offsets/Style';

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default ViewModes;
