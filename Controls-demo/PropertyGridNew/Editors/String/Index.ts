import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/String/Demo';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'string',
            caption: 'String',
            type: 'string',
        },
    ];
    protected _editingObject: object = {
        string: 'Click me to start edit',
    };
}
