import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Calendar/MonthView/CaptionTemplate/CaptionTemplate');
import { date as formatDate } from 'Types/formatter';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    private _month: Date = new Date(2019, 1);

    protected _formatMonth(date: Date): string {
        return date ? formatDate(date, formatDate.SHORT_MONTH) : '';
    }
}

export default Index;
