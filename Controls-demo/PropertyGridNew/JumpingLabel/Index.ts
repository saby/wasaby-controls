import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/JumpingLabel/Index';
import { getEditingObject } from 'Controls-demo/PropertyGridNew/resources/Data';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._editingObject = getEditingObject();
        this._typeDescription = [
            {
                name: 'description',
                caption: 'Описание',
                editorOptions: {
                    placeholder: 'Описание',
                    minLines: 3,
                    jumpingLabel: true,
                },
                editorClass: 'controls-demo-pg-text-editor',
                type: 'text',
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
                type: 'boolean',
            },
            {
                caption: 'URL',
                name: 'siteUrl',
                editorOptions: {
                    placeholder: 'URL',
                    jumpingLabel: true,
                },
                editorClass: 'controls-demo-pg-url-editor',
                type: 'string',
            },
            {
                caption: 'Тип фона',
                name: 'backgroundType',
                type: 'enum',
                editorClass: 'controls-demo-pg-enum-editor',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
