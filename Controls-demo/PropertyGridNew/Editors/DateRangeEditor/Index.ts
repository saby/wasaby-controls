import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/DateRangeEditor/DateRangeEditor';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'dateRange',
            caption: 'DateRange',
            editorTemplateName: 'Controls/propertyGrid:DateRangeEditor',
            editorOptions: {
                mask: 'DD.MM.YYYY',
            },
        },
    ];
    protected _editingObject: object = {
        dateRange: [new Date(2022, 0, 1, 12, 15, 30, 123), new Date(2022, 0, 2, 12, 15, 30, 123)],
    };
}
