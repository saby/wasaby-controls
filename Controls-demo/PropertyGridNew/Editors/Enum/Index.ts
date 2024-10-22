import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Enum } from 'Types/collection';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/Enum/Index';

export default class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'enumEditor',
            caption: 'EnumEditor',
            type: 'enum',
            editorOptions: {
                required: true,
            },
        },
    ];
    protected _editingObject: object = {
        enumEditor: new Enum({
            dictionary: ['left', 'right', 'center', 'justify'],
            index: 0,
        }),
    };
}
