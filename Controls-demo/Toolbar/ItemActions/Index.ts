import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Toolbar/ItemActions/ItemActions');
import { showType } from 'Controls/toolbars';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

class ItemActions extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _itemActions: { id: number; icon: string; title: string }[];
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._itemActionVisibilityCallback = this._itemActionVisibilityCallback.bind(this);
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-ExpandDown',
                title: 'view',
            },
        ];
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '3',
                    icon: 'icon-Print',
                    title: 'Распечатать',
                    '@parent': false,
                    parent: null,
                },
                {
                    id: '4',
                    icon: 'icon-Linked',
                    fontColorStyle: 'secondary',
                    viewMode: 'ghost',
                    iconStyle: 'secondary',
                    contrastBackground: true,
                    title: 'Связанные документы',
                    '@parent': true,
                    parent: null,
                },
                {
                    id: '5',
                    viewMode: 'icon',
                    icon: 'icon-Link',
                    title: 'Скопировать в буфер',
                    '@parent': false,
                    parent: null,
                },
                {
                    id: '7',
                    showType: showType.MENU,
                    title: 'Проекту',
                    '@parent': false,
                    parent: '4',
                },
                {
                    id: '8',
                    showType: showType.MENU,
                    title: 'Этапу',
                    '@parent': false,
                    parent: '4',
                },
            ],
        });
    }
    private _itemActionVisibilityCallback(action: object, item: Model): boolean {
        let actionVisibility = true;
        if (!item.get('parent')) {
            actionVisibility = false;
        }
        return actionVisibility;
    }
}
export default ItemActions;
