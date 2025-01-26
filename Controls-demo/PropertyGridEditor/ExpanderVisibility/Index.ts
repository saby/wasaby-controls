import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridEditor/ExpanderVisibility/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._editingObject = {
            description: null,
            tileView: null,
            showBackgroundImage: true,
            showVideo: true,
        };

        this._typeDescription = [
            {
                name: 'description',
                caption: 'Описание',
                editorClass: 'controls-demo-pg-text-editor',
                '@parent': true,
                parent: null,
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
                '@parent': true,
                parent: null,
            },
            {
                name: 'showVideo',
                caption: 'Показывать видео',
                '@parent': null,
                parent: 'tileView',
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
                '@parent': null,
                parent: 'description',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridEditor/PropertyGridEditor'];
}
