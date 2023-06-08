import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { INavigationOptionValue, INavigationPageSourceConfig } from 'Controls/interface';
import * as template from 'wml!Controls-demo/list_new/Navigation/Cut/Recount/Recount';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import DemoSource from './DemoSource';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return [
        { key: 1, title: 'Запись #1' },
        { key: 2, title: 'Запись #2' },
        { key: 3, title: 'Запись #3' },
    ];
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _navigation: INavigationOptionValue<INavigationPageSourceConfig>;
    private _items: RecordSet;
    private _newKey: number = 3;

    constructor(options: IProps, context?: object) {
        super(options, context);
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }

    protected _onAddItem(): void {
        this._newKey++;
        const newItem = new Model({
            keyProperty: 'key',
            rawData: { key: this._newKey, title: `Запись #${this._newKey}` },
        });
        this._getSource()
            .update(newItem)
            .then(() => {
                return this._items.add(newItem, 0);
            })
            .then(() => {
                return this._children.list.reload();
            });
    }

    protected _onRemoveItem(): void {
        const firstItemKey = this._items.at(0).getKey();
        this._children.list.removeItems({ selected: [firstItemKey], excluded: [] }).then(() => {
            return this._children.list.reload();
        });
    }

    protected _onChangeItem(): void {
        const firstItem = this._items.at(0);
        firstItem.set('title', firstItem.get('title') + ' upd');
        this._getSource().update(firstItem);
    }

    protected _updateItems(): void {
        this._items.each((item) => {
            item.set('title', item.get('title') + ' reloaded');
        });
        this._getSource()
            .update(this._items)
            .then(() => {
                return this._children.list.reload(true);
            });
    }

    private _getSource(): DemoSource {
        return this._options._dataOptionsValue.listData.source;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new DemoSource({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'cut',
                        sourceConfig: {
                            pageSize: 3,
                            hasMore: false,
                            page: 0,
                        },
                    },
                },
            },
        };
    },
});
