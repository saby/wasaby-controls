import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsRow/CustomResultsRow';
import { HierarchicalMemory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Flat;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Flat.getHeader();
    protected _columns: IColumn[] = Flat.getColumns();
    private _fullResultsIndex: number = 0;
    private _partialResultsIndex: number = 0;
    private _items: RecordSet;

    protected _beforeMount(): void {
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }

    private _dataLoadCallback(items: RecordSet): void {
        items.setMetaData({
            ...items.getMetaData(),
            results: this._generateResults(items),
        });
    }

    private _updateMeta(): void {
        this._children.tree.reload();
    }

    private _setMeta(): void {
        this._items.setMetaData({
            ...this._items.getMetaData(),
            results: this._generateResults(this._items),
        });
    }

    private _setResultRow(): void {
        const results = this._items.getMetaData().results;
        results.set('price', Flat.getResults().partial[this._partialResultsIndex]);
        this._fullResultsIndex = ++this._partialResultsIndex % Flat.getResults().partial.length;
    }

    private _generateResults(items: RecordSet): Model {
        const results = new Model({
            // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
            adapter: items.getAdapter(),

            // Устанавливаем тип полей строки итогов.
            format: [
                { name: 'rating', type: 'real' },
                { name: 'price', type: 'real' },
            ],
        });

        const data = Flat.getResults().full[this._fullResultsIndex];
        results.set('rating', data.rating);
        results.set('price', data.price);

        this._fullResultsIndex = ++this._fullResultsIndex % Flat.getResults().full.length;
        return results;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
