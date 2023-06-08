import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/FilterView/DateRangeValidation/Index';
import 'Controls-demo/Filter_new/resources/HistorySourceDemo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];

    protected _beforeMount(): void {
        this._source = [
            {
                name: 'date',
                value: null,
                type: 'dateRange',
                itemTemplate:
                    'wml!Controls-demo/Filter_new/resources/Editors/DateRange',
                validators: [
                    'Controls-demo/Filter_new/FilterView/DateRangeValidation/Validator:Validator.dateRange',
                ],
                editorOptions: {
                    _date: new Date(2022, 0, 30),
                    _displayDate: new Date(2022, 0, 30),
                    emptyCaption: 'Весь период',
                    editorMode: 'Selector',
                    chooseHalfyears: true,
                    chooseYears: true,
                    resetStartValue: null,
                    resetEndValue: null,
                },
                viewMode: 'basic',
            },
        ];
    }

    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
    ];
}
