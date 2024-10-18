import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/SizesAndHeights/SizesAndHeights');

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default ViewModes;
