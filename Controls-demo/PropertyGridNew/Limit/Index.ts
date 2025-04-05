import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Limit/Index';
import { getEditingObject } from 'Controls-demo/PropertyGridNew/resources/Data';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];
    protected _limit: number = 2;

    protected _defaultValidator({ value, item, items }: any): boolean | string {
        return !!value || 'Значение обязательно для заполнения';
    }

    protected _beforeMount(): void {
        this._editingObject = getEditingObject();
        this._typeDescription = [
            {
                name: 'description',
                caption: 'Описание',
                editorOptions: {
                    minLines: 3,
                },
                validators: [this._defaultValidator],
                editorClass: 'controls-demo-pg-text-editor',
                type: 'text',
            },
            {
                name: 'tileView',
                caption: 'Список плиткой',
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
            },
            {
                caption: 'URL',
                name: 'siteUrl',
            },
            {
                caption: 'Тип фона',
                name: 'backgroundType',
                editorClass: 'controls-demo-pg-enum-editor',
            },
            {
                name: 'videoSource',
                caption: 'Источник видео',
                validators: [this._defaultValidator],
            },
        ];
    }

    protected _validate() {
        this._children.validateController.submit();
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
