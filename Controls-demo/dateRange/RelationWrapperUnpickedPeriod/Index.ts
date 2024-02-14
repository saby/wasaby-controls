import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dateRange/RelationWrapperUnpickedPeriod/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _startValue0: Date = new Date(2020, 0, 27);
    protected _endValue0: Date = new Date(2020, 0, 28);
    protected _startValue1 = null;
    protected _endValue1 = null;

    protected _startValue01: Date = new Date(2021, 0, 27);
    protected _endValue01: Date = new Date(2021, 0, 28);
    protected _startValue11 = null;
    protected _endValue11 = null;
}
