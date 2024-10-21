import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridEditor/Caption/CaptionTemplate/Index';
import { getEditingObject } from 'Controls-demo/PropertyGridNew/resources/Data';
import * as CaptionTemplate from 'wml!Controls-demo/PropertyGridEditor/Caption/CaptionTemplate/captionTemplate';

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
                    minLines: 3,
                },
                editorClass: 'controls-demo-pg-text-editor',
                group: 'text',
                type: 'text',
                captionTemplate: CaptionTemplate,
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
                group: 'boolean',
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
                group: 'boolean',
            },
            {
                caption: 'URL',
                name: 'siteUrl',
                group: 'string',
            },
            {
                caption: 'Источник видео',
                name: 'videoSource',
                group: 'string',
            },
            {
                caption: 'Тип фона',
                name: 'backgroundType',
                group: 'enum',
                editorClass: 'controls-demo-pg-enum-editor',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
