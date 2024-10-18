import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/MultiSelectPosition/Custom/Index';
import * as CaptionTemplate from 'wml!Controls-demo/PropertyGridNew/MultiSelectPosition/Custom/resources/CustomCaption';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];
    protected _selectedKeys: string[] = [];

    protected _beforeMount(): void {
        this._editingObject = {
            description: 'Описание',
            tileView: '',
            showBackgroundImage: true,
            showVideo: true,
        };

        this._typeDescription = [
            {
                name: 'description',
                caption: 'Описание',
                type: 'text',
                captionTemplate: CaptionTemplate,
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
                type: 'text',
                captionTemplate: CaptionTemplate,
            },
            {
                name: 'showVideo',
                caption: 'Показывать видео',
                captionTemplate: CaptionTemplate,
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
                captionTemplate: CaptionTemplate,
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
