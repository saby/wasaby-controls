import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/TimeInterval/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'time',
            caption: 'TimeInterval',
            editorTemplateName: 'Controls/propertyGrid:TimeIntervalEditor',
            editorOptions: {
                mask: 'HH:mm',
            },
        },
    ];
    protected _editingObject: object = {
        time: null,
    };
}
