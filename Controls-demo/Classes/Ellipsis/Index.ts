import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Classes/Ellipsis/Ellipsis');
import 'css!Controls/CommonClasses';

class Ellipsis extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Ellipsis;
