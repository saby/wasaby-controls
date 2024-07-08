import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/DateEditor/DateEditor';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'date',
            caption: 'DateEditor',
            type: 'date',
        },
    ];
    protected _editingObject: object = {
        date: new Date(),
    };
}
