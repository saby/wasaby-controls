import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridEditor/Move/Move/Index';
import { showType } from 'Controls/toolbars';
import { Model } from 'Types/entity';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._itemActions = [
            {
                id: 2,
                icon: 'icon-ArrowUp',
                iconStyle: 'secondary',
                showType: showType.MENU,
                title: 'Переместить вверх',
                handler: (item: Model) => {
                    this._children.propertyGrid.moveItemUp(item.getKey());
                },
            },
            {
                id: 3,
                icon: 'icon-ArrowDown',
                iconStyle: 'secondary',
                showType: showType.MENU,
                title: 'Переместить вниз',
                handler: (item: Model) => {
                    this._children.propertyGrid.moveItemDown(item.getKey());
                },
            },
            {
                id: 5,
                icon: 'icon-Folder',
                iconStyle: 'secondary',
                showType: showType.MENU,
                title: 'Переместить в папку',
                handler: (item: Model) => {
                    this._children.propertyGrid.moveWithDialog({
                        selected: [item.getKey()],
                    });
                },
            },
            {
                id: 1,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                showType: showType.MENU,
                title: 'Удалить',
                handler: (item: Model) => {
                    this._children.propertyGrid.removeItems({
                        selected: [item.getKey()],
                    });
                },
            },
        ];
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
                caption: 'Список плиткой, с длинным описанием, чтобы не влезло в отведённую ширину',
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
