import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
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
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextValue } from 'Controls/context';

const DELAY = 1000;

const { getData } = Gadgets;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
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
    }

    _itemsReadyCallback = (items: RecordSet) => {
        this._items = items;
    };

    _itemsReadyCallbackHor = (items: RecordSet) => {
        this._itemsHor = items;
    };

    protected _resolveAdditionalItemTemplate(templateName: string): TemplateFunction {
        switch (templateName) {
            case 'add':
                return AddButton;
            case 'all':
                return MoreButton;
            default:
                return;
        }
    }

    protected _addItem(e: SyntheticEvent, position: 'before' | 'after'): Promise<void> {
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
                this._itemsHor.add(newItem, position === 'before' ? 0 : undefined);
                this._options._dataOptionsValue.AddButton.source.update(newItem).then(() => {
                    resolve();
                });
            }, DELAY);
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            AddButton: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                },
            },
            AddButton2: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                },
            },
        };
    },
});
