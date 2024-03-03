import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { showType } from 'Controls/toolbars';
import { IItemAction } from 'Controls/itemActions';
import { Enum, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IProperty as IPropertyGridItem } from 'Controls/propertyGrid';
import { Memory } from 'Types/source';

import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/AfterEditorTemplate/GridRender/GridRender';

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
                checkboxGroup: [1],
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
                    editorOptions: {
                        minLines: 3,
                        contrastBackground: false,
                    },
                    editorClass: 'controls-demo-pg-text-editor',
                    group: 'text',
                    type: 'text',
                },
                {
                    name: 'checkboxGroup',
                    caption: 'CheckboxGroup',
                    editorTemplateName: 'Controls/propertyGridEditors:CheckboxGroup',
                    editorOptions: {
                        source: new Memory({
                            keyProperty: 'key',
                            data: [
                                {
                                    key: 1,
                                    title: 'First option',
                                },
                                {
                                    key: 2,
                                    title: 'Second option',
                                },
                                {
                                    key: 3,
                                    title: 'Third option',
                                },
                            ],
                        }),
                        keyProperty: 'key',
                    },
                },
                {
                    caption: 'URL',
                    name: 'siteUrl',
                    group: 'string',
                },
                {
                    caption: 'Тип фона',
                    name: 'backgroundType',
                    group: 'enum',
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

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
