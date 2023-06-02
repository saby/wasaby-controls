import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';

import 'css!Controls-demo/tileNew/AddButton/Styles';
import * as Template from 'wml!Controls-demo/tileNew/AddButton/Template';
import { Gadgets } from '../DataHelpers/DataCatalog';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';

import * as AddButton from 'wml!Controls-demo/tileNew/AddButton/AddButton';
import * as MoreButton from 'wml!Controls-demo/tileNew/AddButton/MoreButton';

const DELAY = 1000;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _itemTemplateSource: Memory;
    protected _additionalTemplateSource: Memory;
    protected _items: RecordSet;
    protected _itemsHor: RecordSet;
    protected _itemTemplate: string = 'Controls/tile:ItemTemplate';
    protected _beforeItemsTpl: string = 'none';
    protected _afterItemsTpl: string = 'add';

    protected _beforeMount(): void {
        this._itemTemplateSource = new Memory({
            keyProperty: 'id',
            data: [
                { id: 'Controls/tile:ItemTemplate' },
                { id: 'Controls/tile:PreviewTemplate' },
                { id: 'Controls/tile:SmallItemTemplate' },
                { id: 'Controls/tile:RichTemplate' },
            ],
        });
        this._additionalTemplateSource = new Memory({
            keyProperty: 'id',
            data: [
                { id: 'add', title: 'Кнопка +' },
                { id: 'all', title: 'Кнопка "Все"' },
                { id: 'none', title: 'Выключен' },
            ],
        });
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: Gadgets.getData(),
        });
    }

    _itemsReadyCallback = (items: RecordSet) => {
        this._items = items;
    };

    _itemsReadyCallbackHor = (items: RecordSet) => {
        this._itemsHor = items;
    };

    protected _resolveAdditionalItemTemplate(
        templateName: string
    ): TemplateFunction {
        switch (templateName) {
            case 'add':
                return AddButton;
            case 'all':
                return MoreButton;
            default:
                return;
        }
    }

    protected _addItem(
        e: SyntheticEvent,
        position: 'before' | 'after'
    ): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newItem = new Model({
                    keyProperty: 'id',
                    rawData: {
                        id: this._items.getCount() + 1,
                        title: 'Добавленная запись',
                        image: explorerImages[4],
                    },
                });
                this._items.add(newItem, position === 'before' ? 0 : undefined);
                this._itemsHor.add(
                    newItem,
                    position === 'before' ? 0 : undefined
                );
                this._viewSource.update(newItem).then(() => {
                    resolve();
                });
            }, DELAY);
        });
    }
}
