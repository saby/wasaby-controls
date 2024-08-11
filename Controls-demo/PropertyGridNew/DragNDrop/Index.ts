import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/DragNDrop/Index';
import { showType } from 'Controls/toolbars';
import { IItemAction } from 'Controls/itemActions';
import { Enum, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IPropertyGridItem } from 'Controls/propertyGrid';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: Model;
    protected _typeDescription: RecordSet;
    protected _itemActions: IItemAction[];

    protected _beforeMount(): void {
        this._itemActionVisibilityCallback = this._itemActionVisibilityCallback.bind(this);
        this._editingObject = new Model<IPropertyGridItem>({
            rawData: {
                description: 'This is http://mysite.com',
                tileView: true,
                showBackgroundImage: true,
                siteUrl: 'http://mysite.com',
                videoSource: 'http://youtube.com/video',
                backgroundType: new Enum({
                    dictionary: ['Фоновое изображение', 'Заливка цветом'],
                    index: 0,
                }),
                function: '',
                validate: '',
            },
        });
        this._typeDescription = new RecordSet<IPropertyGridItem>({
            rawData: [
                {
                    name: 'description',
                    caption: 'Описание',
                    group: '1',
                    editorOptions: {
                        minLines: 3,
                        contrastBackground: false,
                    },
                    editorClass: 'controls-demo-pg-text-editor',
                    type: 'text',
                },
                {
                    name: 'tileView',
                    group: '1',
                    caption: 'Список плиткой',
                },
                {
                    caption: 'URL',
                    group: '3',
                    name: 'siteUrl',
                },
                {
                    caption: 'Тип фона',
                    group: '3',
                    name: 'backgroundType',
                    editorClass: 'controls-demo-pg-enum-editor',
                },
                {
                    name: 'validate',
                    caption: '',
                    toggleEditorButtonIcon: 'icon-CreateFolder',
                    type: 'text',
                    editorClass: 'controls-demo-pg-text-editor',
                    editorOptions: {
                        placeholder: 'Условие валидации',
                        minLines: 3,
                    },
                },
            ],
            keyProperty: 'name',
        });
        const source = this._typeDescription;
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
                id: 1,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                showType: showType.MENU,
                title: 'Удалить',
                handler: (item: Model) => {
                    const key = item.getKey();
                    source.remove(source.getRecordById(key));
                },
            },
        ];
    }

    private _getSourceItemIndex(source: RecordSet, item: Model): number {
        const key = item.getKey();
        const sourceItem = source.getRecordById(key);
        return source.getIndex(sourceItem);
    }

    protected _itemActionVisibilityCallback(itemAction: IItemAction, item: Model): boolean {
        const index = this._getSourceItemIndex(this._typeDescription, item);
        if (
            (index === 0 && itemAction.title === 'Переместить вверх') ||
            (index === 4 && itemAction.title === 'Переместить вниз')
        ) {
            return false;
        }
        return true;
    }

    protected _dragEnd(event, entity, target, position): void {
        this._children.propertyGrid.moveItems(entity.getItems(), target, position);
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
