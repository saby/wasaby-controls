import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/Text/Demo';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'textEditor',
            caption: 'TextEditor',
            editorOptions: {
                placeholder: 'TextEditorPlaceholder',
                minLines: 3,
                required: true,
            },
            type: 'text',
            group: 'defaultEditors',
        },
    ];
    protected _editingObject: object = {
        textEditor: 'Click me to start edit',
    };
}
