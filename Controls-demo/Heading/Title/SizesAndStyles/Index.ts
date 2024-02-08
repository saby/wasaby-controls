import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Heading/Title/SizesAndStyles/SizesAndStyles');

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default ViewModes;
