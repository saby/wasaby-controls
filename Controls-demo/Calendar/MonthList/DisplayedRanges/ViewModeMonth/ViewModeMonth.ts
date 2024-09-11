import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Calendar/MonthList/DisplayedRanges/ViewModeMonth/ViewModeMonth');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _displayedRanges: Date[][] = [[new Date(2017, 0), new Date(2019, 0)]];

    protected _position: Date = new Date(2018, 0);
}

export default DemoControl;
