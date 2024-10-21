import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/Boolean/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'selected',
            caption: 'Boolean editor',
        },
    ];
    protected _editingObject: object = {
        selected: true,
    };
}
