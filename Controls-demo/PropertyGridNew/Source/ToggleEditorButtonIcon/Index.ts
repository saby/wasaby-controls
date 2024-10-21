import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { object } from 'Types/util';

import * as template from 'wml!Controls-demo/PropertyGridNew/Source/ToggleEditorButtonIcon/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];
    protected _toggledEditors: string[];

    protected _beforeMount(): void {
        this._editingObject = {
            description: true,
            tileView: false,
            showBackgroundImage: true,
        };

        this._typeDescription = [
            {
                name: 'description',
                caption: 'Описание',
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
            },
            {
                name: 'showVideo',
                caption: 'Показывать видео',
                toggleEditorButtonIcon: 'icon-TFVideoMessage',
                editorTemplateName: 'Controls/propertyGridEditors:Boolean',
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
                toggleEditorButtonIcon: 'icon-Question2',
                editorTemplateName: 'Controls/propertyGridEditors:Boolean',
            },
        ];

        this._toggledEditors = ['showBackgroundImage'];
    }

    protected _toggledEditorsChangedHandler(e: SyntheticEvent, toggledEditors: string[]): void {
        if (toggledEditors !== this._toggledEditors) {
            const editingObject = object.clone(this._editingObject);
            Object.keys(editingObject).forEach((editorName: string) => {
                if (toggledEditors.includes(editorName)) {
                    delete editingObject[editorName];
                }
            });
            this._editingObject = editingObject;
        }
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
