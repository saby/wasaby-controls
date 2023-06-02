import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/CustomResultsCells';
import * as sqResTpl from 'wml!Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/resultCell';
import * as defResTpl from 'wml!Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/resultCellDefault';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths().map(
        (c, i) => {
            return {
                ...c,
                result: undefined,
                // eslint-disable-next-line
                resultTemplate:
                    i === 4 ? sqResTpl : i === 5 ? defResTpl : undefined,
            };
        }
    );
    private _fullResultsIndex: number = 0;
    private _partialResultsIndex: number = 0;
    private _items: RecordSet;

    constructor() {
        super({});
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
    }

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData(),
        });
    }

    private _dataLoadCallback(items: RecordSet): void {
        items.setMetaData({
            ...items.getMetaData(),
            results: this._generateResults(items),
        });
    }

    private _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }

    private _updateMeta(): void {
        this._children.grid.reload();
    }

    private _setMeta(): void {
        this._items.setMetaData({
            ...this._items.getMetaData(),
            results: this._generateResults(this._items),
        });
    }

    private _setResultRow(): void {
        const results = this._items.getMetaData().results;
        results.set(
            'square',
            Countries.getResults().partial[this._partialResultsIndex]
        );
        this._partialResultsIndex =
            ++this._partialResultsIndex % Countries.getResults().partial.length;
    }

    private _generateResults(items: RecordSet): Model {
        const results = new Model({
            // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
            adapter: items.getAdapter(),

            // Устанавливаем тип полей строки итогов.
            format: [
                { name: 'population', type: 'real' },
                { name: 'square', type: 'real' },
                { name: 'populationDensity', type: 'real' },
            ],
        });

        const data = Countries.getResults().full[this._fullResultsIndex];

        results.set('population', data.population);
        results.set('square', data.square);
        results.set('populationDensity', data.populationDensity);

        this._fullResultsIndex =
            ++this._fullResultsIndex % Countries.getResults().full.length;
        return results;
    }
}
