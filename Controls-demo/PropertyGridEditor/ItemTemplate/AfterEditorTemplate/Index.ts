import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridEditor/ItemTemplate/AfterEditorTemplate/Index';
import { getEditingObject } from 'Controls-demo/PropertyGridNew/resources/Data';
import { IProperty } from 'Controls/propertyGrid';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: IProperty[];

    protected _beforeMount(): void {
        this._editingObject = getEditingObject();
        this._typeDescription = [
            {
                name: 'group',
                caption: 'Группа редакторов',
                '@group': true,
            },
            {
                name: 'description',
                caption: 'Описание',
                editorOptions: {
                    minLines: 3,
                },
                editorClass: 'controls-demo-pg-text-editor',
                group: 'group',
                type: 'text',
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
                captionOptions: {
                    underline: 'hovered',
                },
                group: 'group',
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
                group: 'group',
            },
            {
                caption: 'URL',
                name: 'siteUrl',
                captionOptions: {
                    required: true,
                },
                group: 'group',
            },
            {
                caption: 'Источник видео',
                name: 'videoSource',
                captionOptions: {
                    required: true,
                },
                group: 'group',
            },
            {
                caption: 'Тип фона',
                captionOptions: {
                    underline: 'fixed',
                },
                name: 'backgroundType',
                group: 'group',
                editorClass: 'controls-demo-pg-enum-editor',
            },
        ];
    }
}
