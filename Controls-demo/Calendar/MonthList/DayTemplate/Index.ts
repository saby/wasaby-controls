import { Control, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/Calendar/MonthList/DayTemplate/DayTemplate';
import 'css!Controls-demo/Calendar/MonthList/resources/MonthListDemo';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
