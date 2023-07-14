import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/CompactDatePicker/FullDemo/FullDemo');
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default class RangeCompactSelector extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
