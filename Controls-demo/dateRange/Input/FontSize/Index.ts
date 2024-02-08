import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dateRange/Input/FontSize/FontSize');

class FontSize extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _startDate: Date = new Date(2023, 5, 25);
    protected _endDate: Date = new Date(2023, 5, 26);
}
export default FontSize;
