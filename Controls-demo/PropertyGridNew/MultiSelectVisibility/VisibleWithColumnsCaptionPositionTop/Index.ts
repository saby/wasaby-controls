import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/MultiSelectVisibility/VisibleWithColumnsCaptionPositionTop/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

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
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
                type: 'text',
            },
            {
                name: 'showVideo',
                caption: 'Показывать видео',
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
